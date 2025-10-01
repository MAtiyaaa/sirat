-- Add UPDATE and DELETE policies for ai_messages table
CREATE POLICY "Users can update messages in their conversations"
ON public.ai_messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM ai_conversations
    WHERE ai_conversations.id = ai_messages.conversation_id
    AND ai_conversations.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete messages in their conversations"
ON public.ai_messages
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM ai_conversations
    WHERE ai_conversations.id = ai_messages.conversation_id
    AND ai_conversations.user_id = auth.uid()
  )
);

-- Fix update_updated_at_column function to set search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;