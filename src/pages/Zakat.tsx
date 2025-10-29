import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DirhamIcon } from "@/components/DirhamIcon";

type User = {
  id: string;
} | null;

const CURRENCIES = [
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", icon: "dirham" as const },
  { code: "BHD", symbol: "د.ب", name: "Bahraini Dinar", icon: null },
  { code: "EGP", symbol: "ج.م", name: "Egyptian Pound", icon: null },
  { code: "EUR", symbol: "€", name: "Euro", icon: null },
  { code: "GBP", symbol: "£", name: "British Pound", icon: null },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", icon: null },
  { code: "INR", symbol: "₹", name: "Indian Rupee", icon: null },
  { code: "IRR", symbol: "﷼", name: "Iranian Rial", icon: null },
  { code: "JOD", symbol: "د.ا", name: "Jordanian Dinar", icon: null },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar", icon: null },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", icon: null },
  { code: "OMR", symbol: "ر.ع", name: "Omani Rial", icon: null },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", icon: null },
  { code: "QAR", symbol: "ر.ق", name: "Qatari Riyal", icon: null },
  { code: "SAR", symbol: "ر.س", name: "Saudi Riyal", icon: null },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", icon: null },
  { code: "USD", symbol: "$", name: "US Dollar", icon: null },
  { code: "YER", symbol: "﷼", name: "Yemeni Rial", icon: null },
] as const;

const currencyFromLocale = (locale: string | undefined) => {
  const map: Record<string, string> = {
    "ar-SA": "SAR",
    "ar-AE": "AED",
    "ar-EG": "EGP",
    "tr-TR": "TRY",
    "en-GB": "GBP",
    "en-IN": "INR",
    "ur-PK": "PKR",
    "ms-MY": "MYR",
  };
  return (locale && map[locale]) || "AED";
};

const content = {
  ar: {
    title: "حاسبة الزكاة",
    subtitle: "احسب زكاتك بناءً على أصولك والتزاماتك",
    currency: "العملة",
    nisabBasis: "أساس النصاب",
    gold: "ذهب (85 جرام)",
    silver: "فضة (595 جرام)",
    goldPrice: "سعر الذهب لكل جرام",
    silverPrice: "سعر الفضة لكل جرام",
    assets: "الأصول",
    cashBank: "النقد والبنك",
    crypto: "العملات الرقمية",
    goldGrams: "الذهب (بالجرام)",
    silverGrams: "الفضة (بالجرام)",
    businessAssets: "أصول الأعمال",
    receivables: "الديون المستحقة",
    investments: "الاستثمارات (الجزء الخاضع للزكاة)",
    liabilities: "الالتزامات قصيرة الأجل",
    results: "النتائج",
    totalAssets: "إجمالي الأصول",
    totalLiabilities: "إجمالي الالتزامات",
    netAssets: "صافي الأصول الزكوية",
    nisabThreshold: "حد النصاب",
    qualifies: "تجب عليك الزكاة",
    notQualifies: "لا تجب عليك الزكاة",
    zakatDue: "الزكاة المستحقة (2.5%)",
    explanation:
      "الزكاة واجبة على كل مسلم بالغ عاقل يملك نصاباً من المال الذي مر عليه حول كامل. النصاب هو 85 جرام من الذهب أو 595 جرام من الفضة. مقدار الزكاة هو 2.5% من صافي الأصول الزكوية.",
    privacyNote: "جميع البيانات خاصة بك ولن يتم مشاركتها.",
    signInRequired: "يرجى تسجيل الدخول لحفظ بياناتك",
    enterPriceNote: "أدخل سعر الجرام للذهب/الفضة لحساب حد النصاب بدقة.",
    updatePrices: "تحديث الأسعار",
    priceHeader: "أسعار الذهب والفضة الحالية",
    pricesUpdated: "تم جلب أسعار الذهب والفضة الحالية",
    pricesFailed: "فشل في جلب الأسعار",
    enterManually: "يرجى إدخال الأسعار يدوياً",
    back: "رجوع",
  },
  en: {
    title: "Zakat Calculator",
    subtitle: "Calculate your Zakat based on your assets and liabilities",
    currency: "Currency",
    nisabBasis: "Nisab Basis",
    gold: "Gold (85g)",
    silver: "Silver (595g)",
    goldPrice: "Gold Price per Gram",
    silverPrice: "Silver Price per Gram",
    assets: "Assets",
    cashBank: "Cash & Bank",
    crypto: "Cryptocurrency",
    goldGrams: "Gold (grams)",
    silverGrams: "Silver (grams)",
    businessAssets: "Business Assets",
    receivables: "Receivables",
    investments: "Investments (zakatable portion)",
    liabilities: "Short-term Liabilities",
    results: "Results",
    totalAssets: "Total Assets",
    totalLiabilities: "Total Liabilities",
    netAssets: "Net Zakatable Assets",
    nisabThreshold: "Nisab Threshold",
    qualifies: "You qualify for Zakat",
    notQualifies: "You do not qualify for Zakat",
    zakatDue: "Zakat Due (2.5%)",
    explanation:
      "Zakat is obligatory for every adult Muslim who possesses the nisab (minimum threshold) for one lunar year. The nisab is equivalent to 85 grams of gold or 595 grams of silver. The Zakat rate is 2.5% of net zakatable assets.",
    privacyNote: "All your data is private and will not be shared.",
    signInRequired: "Please sign in to save your data",
    enterPriceNote: "Enter price/gram for gold/silver to compute nisab accurately.",
    updatePrices: "Update Prices",
    priceHeader: "Current Gold & Silver Prices",
    pricesUpdated: "Current gold and silver prices fetched",
    pricesFailed: "Failed to fetch prices",
    enterManually: "Please enter prices manually",
    back: "Back",
  },
};

const Zakat = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const t = content[(settings.language as "ar" | "en") || "en"];

  // ---- core state
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingPrices, setFetchingPrices] = useState(false);

  // form state
  const [currency, setCurrency] = useState<string>("AED"); // hard default = AED
  const [nisabBasis, setNisabBasis] = useState<"gold" | "silver">("gold");
  const [goldPricePerGram, setGoldPricePerGram] = useState<string>("");
  const [silverPricePerGram, setSilverPricePerGram] = useState<string>("");
  const [cashBank, setCashBank] = useState<string>("");
  const [crypto, setCrypto] = useState<string>("");
  const [goldGrams, setGoldGrams] = useState<string>("");
  const [silverGrams, setSilverGrams] = useState<string>("");
  const [businessAssets, setBusinessAssets] = useState<string>("");
  const [receivables, setReceivables] = useState<string>("");
  const [investments, setInvestments] = useState<string>("");
  const [liabilities, setLiabilities] = useState<string>("");

  // ---- price fetcher
  const fetchRealTimePrices = async (currencyCode: string) => {
    setFetchingPrices(true);
    try {
      const goldResponse = await fetch(`https://api.gold-api.com/price/XAU`);
      if (!goldResponse.ok) throw new Error("Failed to fetch gold price");
      const goldData = await goldResponse.json();

      const silverResponse = await fetch(`https://api.gold-api.com/price/XAG`);
      if (!silverResponse.ok) throw new Error("Failed to fetch silver price");
      const silverData = await silverResponse.json();

      // gold-api returns per troy ounce (USD). Convert to per gram.
      const ozToGram = 31.1035;
      const goldPerGramUSD = (goldData?.price ?? 0) / ozToGram;
      const silverPerGramUSD = (silverData?.price ?? 0) / ozToGram;

      let conversionRate = 1;
      if (currencyCode !== "USD") {
        const ratesResponse = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        if (!ratesResponse.ok) throw new Error("Failed to fetch FX rates");
        const ratesData = await ratesResponse.json();
        conversionRate = ratesData?.rates?.[currencyCode] ?? 1;
      }

      setGoldPricePerGram((goldPerGramUSD * conversionRate).toFixed(2));
      setSilverPricePerGram((silverPerGramUSD * conversionRate).toFixed(2));

      toast({
        title: t.pricesUpdated,
        description: "",
      });
    } catch (err) {
      console.error("Error fetching prices:", err);
      toast({
        title: t.pricesFailed,
        description: t.enterManually,
        variant: "destructive",
      });
    } finally {
      setFetchingPrices(false);
    }
  };

  // ---- startup: decide currency once (saved > locale > AED), load saved data, then fetch prices
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!mounted) return;

        const authedUser = authData?.user ?? null;
        setUser(authedUser);

        // baseline choice
        let nextCurrency = currencyFromLocale(typeof navigator !== "undefined" ? navigator.language : undefined);

        if (authedUser) {
          const { data, error } = await supabase
            .from("user_zakat_data")
            .select("*")
            .eq("user_id", authedUser.id)
            .maybeSingle();

          if (error) throw error;

          if (data) {
            // only apply saved currency if present
            if (data.currency) nextCurrency = data.currency;

            // load the rest
            if (data.nisab_basis) setNisabBasis(data.nisab_basis as "gold" | "silver");
            if (typeof data.gold_price_per_gram === "number") setGoldPricePerGram(String(data.gold_price_per_gram));
            if (typeof data.silver_price_per_gram === "number")
              setSilverPricePerGram(String(data.silver_price_per_gram));
            if (typeof data.cash_bank === "number") setCashBank(String(data.cash_bank));
            if (typeof data.crypto === "number") setCrypto(String(data.crypto));
            if (typeof data.gold_grams === "number") setGoldGrams(String(data.gold_grams));
            if (typeof data.silver_grams === "number") setSilverGrams(String(data.silver_grams));
            if (typeof data.business_assets === "number") setBusinessAssets(String(data.business_assets));
            if (typeof data.receivables === "number") setReceivables(String(data.receivables));
            if (typeof data.investments === "number") setInvestments(String(data.investments));
            if (typeof data.liabilities === "number") setLiabilities(String(data.liabilities));
          }
        }

        setCurrency(nextCurrency);
        // if saved prices existed we don't *have* to fetch, but fetching ensures freshness
        fetchRealTimePrices(nextCurrency);
      } catch (e) {
        console.error("Init error:", e);
        // still make sure we have prices for AED default at least
        fetchRealTimePrices("AED");
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- save
  const saveZakatData = async () => {
    if (!user) {
      toast({ title: t.signInRequired, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("user_zakat_data").upsert({
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

      toast({ title: settings.language === "ar" ? "تم حفظ البيانات بنجاح" : "Data saved successfully" });
    } catch (err) {
      console.error("Error saving zakat data:", err);
      toast({
        title: settings.language === "ar" ? "فشل في حفظ البيانات" : "Failed to save data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---- calculations (memoized so we don’t recompute every render)
  const results = useMemo(() => {
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

    const priceMissing = nisabBasis === "gold" ? goldPrice <= 0 : silverPrice <= 0;

    const nisabValue = priceMissing ? NaN : nisabBasis === "gold" ? 85 * goldPrice : 595 * silverPrice;

    const qualifies = !isNaN(nisabValue) && netAssets >= nisabValue;
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
  }, [
    goldPricePerGram,
    silverPricePerGram,
    goldGrams,
    silverGrams,
    cashBank,
    crypto,
    businessAssets,
    receivables,
    investments,
    liabilities,
    nisabBasis,
  ]);

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency);
  const currencySymbol = selectedCurrency?.symbol || "$";
  const showDirhamIcon = selectedCurrency?.icon === "dirham";

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0" aria-label={t.back}>
            <ArrowLeft className={`h-5 w-5 ${settings.language === "ar" ? "rotate-180" : ""}`} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        {/* Currency & Nisab */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {t.currency} & {t.nisabBasis}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">{t.currency}</Label>
                <Select
                  value={currency}
                  onValueChange={(val) => {
                    setCurrency(val);
                    // fetch prices for any selection (not only AED)
                    fetchRealTimePrices(val);
                  }}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        <div className="flex items-center gap-2">
                          {curr.icon === "dirham" ? <DirhamIcon size={16} /> : <span>{curr.symbol}</span>}
                          <span>{curr.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nisab">{t.nisabBasis}</Label>
                <Select value={nisabBasis} onValueChange={(v) => setNisabBasis(v as "gold" | "silver")}>
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

            {/* Prices */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{t.priceHeader}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchRealTimePrices(currency)}
                  disabled={fetchingPrices}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${fetchingPrices ? "animate-spin" : ""}`} />
                  {t.updatePrices}
                </Button>
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
            </div>
          </CardContent>
        </Card>

        {/* Assets */}
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

        {/* Results */}
        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>{t.results}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">{t.totalAssets}</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {showDirhamIcon && <DirhamIcon size={24} />}
                  {!showDirhamIcon && currencySymbol}
                  {results.totalAssets.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">{t.totalLiabilities}</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {showDirhamIcon && <DirhamIcon size={24} />}
                  {!showDirhamIcon && currencySymbol}
                  {results.totalLiabilities.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">{t.netAssets}</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {showDirhamIcon && <DirhamIcon size={24} />}
                  {!showDirhamIcon && currencySymbol}
                  {results.netAssets.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">{t.nisabThreshold}</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {isNaN(results.nisabValue) ? (
                    "—"
                  ) : (
                    <>
                      {showDirhamIcon && <DirhamIcon size={24} />}
                      {!showDirhamIcon && currencySymbol}
                      {results.nisabValue.toFixed(2)}
                    </>
                  )}
                </p>
              </div>
            </div>

            {results.priceMissing ? (
              <div className="p-4 rounded-lg text-center bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                {t.enterPriceNote}
              </div>
            ) : (
              <div
                className={`p-4 rounded-lg text-center ${results.qualifies ? "bg-primary/10 text-primary" : "bg-muted"}`}
              >
                <p className="font-semibold text-lg mb-2">{results.qualifies ? t.qualifies : t.notQualifies}</p>
                {results.qualifies && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{t.zakatDue}</p>
                    <p className="text-3xl font-bold flex items-center justify-center gap-2">
                      {showDirhamIcon && <DirhamIcon size={32} />}
                      {!showDirhamIcon && currencySymbol}
                      {results.zakatDue.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">{t.explanation}</div>

            <div className="flex justify-end">
              <Button onClick={saveZakatData} disabled={loading}>
                {settings.language === "ar" ? "حفظ البيانات" : "Save Data"}
              </Button>
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
