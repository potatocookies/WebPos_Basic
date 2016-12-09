using System;
using System.Collections.Generic;

namespace wpCommon
{
    public interface ICommonAttribute
    {
        string name { get; set; }
        string value { get; set; }
    }

    public interface IDocumentPayment
    {
        Guid UID { get; set; }
        int Number { get; set; }
        int PaymentType { get; set; }
        string PaymentDescription { get; set; }
        string CurrencyISOCode { get; set; }
        string CurrencyRate { get; set; }
        double Amount { get; set; }
        double LocalCurrencyAmount { get; set; }

        List<ICommonAttribute> Attributes { get; set; }
    }

    public interface IDocumentItem
    {
        Guid UID { get; set; }
        int Number { get; set; }
        string VART { get; set; }
        string EAN { get; set; }
        string Text { get; set; }
        string Size { get; set; }
        string Colour { get; set; }
        int Flags { get; set; }
        int SetNumber { get; set; }
        int SetItemNumber { get; set; }
        float SetPrice { get; set; }
        int VATIndex { get; set; }
        double VATValue { get; set; }
        double Quantity { get; set; }

        int MeasurementUnit { get; set; }
        int DiscountType { get; set; }
        int DiscountID { get; set; }
        double DiscountValue { get; set; }
        double OriginalPrice { get; set; }
        double TotalPriceWithVATBeforeDiscount { get; set; }
        double TotalItemDiscount { get; set; }
        double TotalDiscount { get; set; }
        double TotalPriceWithVAT { get; set; }
        double TotalPriceWithVATAndRounding { get; set; }
        double TotalVAT { get; set; }

        List<ICommonAttribute> Attributes { get; set; }
    }

    public interface IEETItem
    {
        DateTime eetActionTime { get; set; }
        int      errorCode { get; set; }
        String   fik { get; }
        String   pkp { get; }
        String   bkp { get; }
        String   errorMessage { get; set; }
        String   eetFullRequest { get; set; }
        String   eetFullResponse { get; set; }
        String   eetUUID { get; set; }
    }

    public class IDocumentHeader
    {
        Guid UID { get; set; }
        Guid UIDOriginal { get; set; }
        int DocumentType { get; set; }
        int DocumentSubType { get; set; }
        string ShopNumber { get; set; }
        int POSNumber { get; set; }
        int SellerNumber { get; set; }
        Int64 ContactNumber { get; set; }
        int DocumentNumber { get; set; }
        int FinBalanceNumber { get; set; }
        string DocumentDate { get; set; }
        double TotalPriceWithVAT { get; set; }
        double TotalVAT { get; set; }
        int DiscountType { get; set; }
        int DiscountID { get; set; }
        double DiscountValue { get; set; }
        double TotalDiscount { get; set; }
        string Note { get; set; }
        List<IDocumentItem> Items { get; set; }
        List<IDocumentPayment> Payments { get; set; }
        List<ICommonAttribute> Attributes { get; set; }
    }
}