import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Copy } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { paymentSchema, type PaymentFormData } from "@/lib/validations/payment";
import { useCreatePayment } from "@/hooks/useCreatePayment";
import { useClients } from "@/hooks/useClients";
import { toast } from "sonner";

export function PaymentForm() {
  const [dueDate, setDueDate] = useState<Date>();
  const [paymentCode, setPaymentCode] = useState<string>("");
  
  const { data: clients } = useClients();
  const createPayment = useCreatePayment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const selectedPaymentMethod = watch("payment_method");

  const generatePaymentCode = () => {
    const code = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`.toUpperCase();
    setPaymentCode(code);
    setValue("payment_code", code);
    toast.success("Código de pagamento gerado!");
  };

  const copyPaymentCode = () => {
    if (paymentCode) {
      navigator.clipboard.writeText(paymentCode);
      toast.success("Código copiado!");
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    await createPayment.mutateAsync(data);
    reset();
    setDueDate(undefined);
    setPaymentCode("");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client_id">Cliente *</Label>
          <Select
            onValueChange={(value) => setValue("client_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} {client.company && `(${client.company})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.client_id && (
            <p className="text-sm text-destructive">{errors.client_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contract_value">Valor do Contrato *</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("contract_value", { valueAsNumber: true })}
          />
          {errors.contract_value && (
            <p className="text-sm text-destructive">{errors.contract_value.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_frequency">Frequência *</Label>
          <Select
            onValueChange={(value) => setValue("payment_frequency", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one_time">Pagamento Único</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="annual">Anual</SelectItem>
            </SelectContent>
          </Select>
          {errors.payment_frequency && (
            <p className="text-sm text-destructive">{errors.payment_frequency.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_method">Método de Pagamento *</Label>
          <Select
            onValueChange={(value) => setValue("payment_method", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="boleto">Boleto</SelectItem>
              <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
              <SelectItem value="transfer">Transferência</SelectItem>
            </SelectContent>
          </Select>
          {errors.payment_method && (
            <p className="text-sm text-destructive">{errors.payment_method.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Data de Vencimento *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : "Selecione a data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  setDueDate(date);
                  setValue("due_date", date ? format(date, "yyyy-MM-dd") : "");
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.due_date && (
            <p className="text-sm text-destructive">{errors.due_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Código de Pagamento</Label>
          <div className="flex gap-2">
            <Input
              value={paymentCode}
              onChange={(e) => {
                setPaymentCode(e.target.value);
                setValue("payment_code", e.target.value);
              }}
              placeholder="Gerar ou inserir código"
              readOnly={selectedPaymentMethod === "pix"}
            />
            {selectedPaymentMethod === "pix" && (
              <>
                <Button type="button" onClick={generatePaymentCode} variant="outline">
                  Gerar PIX
                </Button>
                {paymentCode && (
                  <Button type="button" onClick={copyPaymentCode} variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          {...register("notes")}
          placeholder="Informações adicionais sobre o pagamento..."
          rows={3}
        />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes.message}</p>
        )}
      </div>

      <Button type="submit" disabled={createPayment.isPending}>
        {createPayment.isPending ? "Salvando..." : "Registrar Pagamento"}
      </Button>
    </form>
  );
}
