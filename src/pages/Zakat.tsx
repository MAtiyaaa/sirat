import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calculator } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'EGP', symbol: 'ج.م', name: 'Egyptian Pound' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
];

const Zakat = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [currency, setCurrency] = useState('USD');
  const [nisabBasis, setNisabBasis] = useState<'gold' | 'silver'>('gold');
  const [goldPricePerGram, setGoldPricePerGram] = useState('');
  const [silverPricePerGram, setSilverPricePerGram] = useState('');
  const [cashBank, setCashBank] = useState('');
  const [crypto, setCrypto] = useState('');
  const [goldGrams, setGoldGrams] = useState('');
  const [silverGrams, setSilverGrams] = useState('');
  const [businessAssets, setBusinessAssets] = useState('');
  const [receivables, setReceivables] = useState('');
  const [investments, setInvestments] = useState('');
  const [liabilities, setLiabilities] = useState('');

  const content = {
    ar: {
      title: 'حاسبة الزكاة',
      subtitle: 'احسب زكاتك بناءً على أصولك والتزاماتك',
      currency: 'العملة',
      nisabBasis: 'أساس النصاب',
      gold: 'ذهب (85 جرام)',
      silver: 'فضة (595 جرام)',
      goldPrice: 'سعر الذهب لكل جرام',
      silverPrice: 'سعر الفضة لكل جرام',
      assets: 'الأصول',
      cashBank: 'النقد والبنك',
      crypto: 'العملات الرقمية',
      goldGrams: 'الذهب (بالجرام)',
      silverGrams: 'الفضة (بالجرام)',
      businessAssets: 'أصول الأعمال',
      receivables: 'الديون المستحقة',
      investments: 'الاستثمارات (الجزء الخاضع للزكاة)',
      liabilities: 'الالتزامات قصيرة الأجل',
      calculate: 'احسب الزكاة',
      save: 'حفظ البيانات',
      results: 'النتائج',
      totalAssets: 'إجمالي الأصول',
      totalLiabilities: 'إجمالي الالتزامات',
      netAssets: 'صافي الأصول الزكوية',
      nisabThreshold: 'حد النصاب',
      qualifies: 'تجب عليك الزكاة',
      notQualifies: 'لا تجب عليك الزكاة',
      zakatDue: 'الزكاة المستحقة (2.5%)',
      explanation: 'الزكاة واجبة على كل مسلم بالغ عاقل يملك نصاباً من المال الذي مر عليه حول كامل. النصاب هو 85 جرام من الذهب أو 595 جرام من الفضة. مقدار الزكاة هو 2.5% من صافي الأصول الزكوية.',
      privacyNote: 'جميع البيانات خاصة بك ولن يتم مشاركتها.',
      signInRequired: 'يرجى تسجيل الدخول لحفظ بياناتك',
      enterPriceNote: 'أدخل سعر الجرام للذهب/الفضة لحساب حد النصاب بدقة.',
    },
    en: {
      title: 'Zakat Calculator',
      subtitle: 'Calculate your Zakat based on your assets and liabilities',
      currency: 'Currency',
      nisabBasis: 'Nisab Basis',
      gold: 'Gold (85g)',
      silver: 'Silver (595g)',
      goldPrice: 'Gold Price per Gram',
      silverPrice: 'Silver Price per Gram',
      assets: 'Assets',
      cashBank: 'Cash & Bank',
      crypto: 'Cryptocurrency',
      goldGrams: 'Gold (grams)',
      silverGrams: 'Silver (grams)',
      businessAssets: 'Business Assets',
      receivables: 'Receivables',
      investments: 'Investments (zakatable portion)',
      liabilities: 'Short-term Liabilities',
      calculate: 'Calculate Zakat',
      save: 'Save Data',
      results: 'Results',
      totalAssets: 'Total Assets',
      totalLiabilities: 'Total Liabilities',
      netAssets: 'Net Zakatable Assets',
      nisabThreshold: 'Nisab Threshold',
      qualifies: 'You qualify for Zakat',
      notQualifies: 'You do not qualify for Zakat',
      zakatDue: 'Zakat Due (2.5%)',
      explanation: 'Zakat is obligatory for every adult Muslim who possesses the nisab (minimum threshold) for one lunar year. The nisab is equivalent to 85 grams of gold or 595 grams of silver. The Zakat rate is 2.5% of net zakatable assets.',
      privacyNote: 'All your data is private and will not be shared.',
      signInRequired: 'Please sign in to save your data',
      enterPriceNote: 'Enter price/gram for gold/silver to compute nisab accurately.',
    },
  };

  const t = content[settings.language as keyof typeof content];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadZakatData(user.id);
      }
    });

    // Detect currency from locale
    const userLocale = navigator.language;
    const currencyMap: Record<string, string> = {
      'ar-SA': 'SAR',
      'ar-AE': 'AED',
      'ar-EG': 'EGP',
      'tr-TR': 'TRY',
      'en-GB': 'GBP',
      'en-IN': 'INR',
      'ur-PK': 'PKR',
      'ms-MY': 'MYR',
    };
    
    const detectedCurrency = currencyMap[userLocale] || 'USD';
    setCurrency(detectedCurrency);
  }, []);

  const loadZakatData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_zakat_data')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCurrency(data.currency || 'USD');
        setNisabBasis(data.nisab_basis as 'gold' | 'silver');
        setGoldPricePerGram(data.gold_price_per_gram?.toString() || '');
        setSilverPricePerGram(data.silver_price_per_gram?.toString() || '');
        setCashBank(data.cash_bank?.toString() || '');
        setCrypto(data.crypto?.toString() || '');
        setGoldGrams(data.gold_grams?.toString() || '');
        setSilverGrams(data.silver_grams?.toString() || '');
        setBusinessAssets(data.business_assets?.toString() || '');
        setReceivables(data.receivables?.toString() || '');
        setInvestments(data.investments?.toString() || '');
        setLiabilities(data.liabilities?.toString() || '');
      }
    } catch (error) {
      console.error('Error loading zakat data:', error);
    }
  };

  const saveZakatData = async () => {
    if (!user) {
      toast({
        title: t.signInRequired,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_zakat_data')
        .upsert({
          user_id: user.id,
          currency,
          nisab_basis: nisabBasis,
          gold_price_per_gram: parseFloat(goldPricePerGram) || 0,
          silver_price_per_gram: parseFloat(silverPricePerGram) || 0,
          cash_bank: parseFloat(cashBank) || 0,
          crypto: parseFloat(crypto) || 0,
          gold_grams: parseFloat(goldGrams) || 0,
          silver_grams: parseFloat(silverGrams) || 0,
          business_assets: parseFloat(businessAssets) || 0,
          receivables: parseFloat(receivables) || 0,
          investments: parseFloat(investments) || 0,
          liabilities: parseFloat(liabilities) || 0,
        });

      if (error) throw error;

      toast({
        title: settings.language === 'ar' ? 'تم حفظ البيانات بنجاح' : 'Data saved successfully',
      });
    } catch (error) {
      console.error('Error saving zakat data:', error);
      toast({
        title: settings.language === 'ar' ? 'فشل في حفظ البيانات' : 'Failed to save data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateZakat = () => {
    const goldPrice = parseFloat(goldPricePerGram) || 0;
    const silverPrice = parseFloat(silverPricePerGram) || 0;

    const goldValue = (parseFloat(goldGrams) || 0) * goldPrice;
    const silverValue = (parseFloat(silverGrams) || 0) * silverPrice;
    
    const totalAssets = 
      (parseFloat(cashBank) || 0) +
      (parseFloat(crypto) || 0) +
      goldValue +
      silverValue +
      (parseFloat(businessAssets) || 0) +
      (parseFloat(receivables) || 0) +
      (parseFloat(investments) || 0);

    const totalLiabilities = parseFloat(liabilities) || 0;
    const netAssets = totalAssets - totalLiabilities;

    // Require valid price/gram for chosen basis to compute nisab correctly
    const priceMissing = nisabBasis === 'gold'
      ? goldPrice <= 0
      : silverPrice <= 0;

    const nisabValue = priceMissing
      ? NaN
      : (nisabBasis === 'gold'
          ? 85 * goldPrice
          : 595 * silverPrice);

    // Only qualify if nisabValue is valid and netAssets >= nisab
    const qualifies = !isNaN(nisabValue) && netAssets >= nisabValue;

    // Zakat is 2.5% of NET if qualifies; also never charge on negative net
    const zakatBase = Math.max(0, netAssets);
    const zakatDue = qualifies ? zakatBase * 0.025 : 0;

    return {
      totalAssets,
      totalLiabilities,
      netAssets,
      nisabValue,
      qualifies,
      zakatDue,
      priceMissing,
    };
  };

  const results = calculateZakat();
  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '$';

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
            aria-label={settings.language === 'ar' ? 'رجوع' : 'Back'}
          >
            <ArrowLeft className={`h-5 w-5 ${settings.language === 'ar' ? 'rotate-180' : ''}`} />
          </Button>
          <h1 className="text-3xl font-bold">{t.title}</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t.currency} & {t.nisabBasis}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">{t.currency}</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nisab">{t.nisabBasis}</Label>
                <Select value={nisabBasis} onValueChange={(v) => setNisabBasis(v as 'gold' | 'silver')}>
                  <SelectTrigger id="nisab">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">{t.gold}</SelectItem>
                    <SelectItem value="silver">{t.silver}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goldPrice">{t.goldPrice}</Label>
                <Input
                  id="goldPrice"
                  type="number"
                  step="0.01"
                  value={goldPricePerGram}
                  onChange={(e) => setGoldPricePerGram(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="silverPrice">{t.silverPrice}</Label>
                <Input
                  id="silverPrice"
                  type="number"
                  step="0.01"
                  value={silverPricePerGram}
                  onChange={(e) => setSilverPricePerGram(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t.assets}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cashBank">{t.cashBank}</Label>
                <Input
                  id="cashBank"
                  type="number"
                  step="0.01"
                  value={cashBank}
                  onChange={(e) => setCashBank(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crypto">{t.crypto}</Label>
                <Input
                  id="crypto"
                  type="number"
                  step="0.01"
                  value={crypto}
                  onChange={(e) => setCrypto(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goldGrams">{t.goldGrams}</Label>
                <Input
                  id="goldGrams"
                  type="number"
                  step="0.01"
                  value={goldGrams}
                  onChange={(e) => setGoldGrams(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="silverGrams">{t.silverGrams}</Label>
                <Input
                  id="silverGrams"
                  type="number"
                  step="0.01"
                  value={silverGrams}
                  onChange={(e) => setSilverGrams(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAssets">{t.businessAssets}</Label>
                <Input
                  id="businessAssets"
                  type="number"
                  step="0.01"
                  value={businessAssets}
                  onChange={(e) => setBusinessAssets(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receivables">{t.receivables}</Label>
                <Input
                  id="receivables"
                  type="number"
                  step="0.01"
                  value={receivables}
                  onChange={(e) => setReceivables(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investments">{t.investments}</Label>
                <Input
                  id="investments"
                  type="number"
                  step="0.01"
                  value={investments}
                  onChange={(e) => setInvestments(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="liabilities">{t.liabilities}</Label>
                <Input
                  id="liabilities"
                  type="number"
                  step="0.01"
                  value={liabilities}
                  onChange={(e) => setLiabilities(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>{t.results}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">{t.totalAssets}</p>
                <p className="text-2xl font-bold">{currencySymbol}{results.totalAssets.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">{t.totalLiabilities}</p>
                <p className="text-2xl font-bold">{currencySymbol}{results.totalLiabilities.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">{t.netAssets}</p>
                <p className="text-2xl font-bold">{currencySymbol}{results.netAssets.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">{t.nisabThreshold}</p>
                <p className="text-2xl font-bold">
                  {isNaN(results.nisabValue) ? '—' : `${currencySymbol}${results.nisabValue.toFixed(2)}`}
                </p>
              </div>
            </div>

            {results.priceMissing ? (
              <div className="p-4 rounded-lg text-center bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                {t.enterPriceNote}
              </div>
            ) : (
              <div className={`p-4 rounded-lg text-center ${results.qualifies ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                <p className="font-semibold text-lg mb-2">
                  {results.qualifies ? t.qualifies : t.notQualifies}
                </p>
                {results.qualifies && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{t.zakatDue}</p>
                    <p className="text-3xl font-bold">{currencySymbol}{results.zakatDue.toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}

            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              {t.explanation}
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <p className="text-xs text-center text-muted-foreground">{t.privacyNote}</p>
        </div>
      </div>
    </div>
  );
};

export default Zakat;
