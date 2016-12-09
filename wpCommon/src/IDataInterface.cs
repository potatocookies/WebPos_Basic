using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalInterface;

namespace wpCommon
{
    public interface IArticle
    {
        Guid     UID { get; }
        string   VART { get; }
        string   GTIN { get; }
        string   AGN { get; }
        string   LinkedVART { get; }
        string   Decription { get; }
        decimal  RetailPrice { get; }
        decimal  PurchasePrice { get; }
        int      VariantIndex1 { get; }
        int      VariantIndex2 { get; }
        int      VariantIndex3 { get; }
        string   VariantText1 { get; }
        string   VariantText2 { get; }
        string   VariantText3 { get; }
        int      VATID { get; }
        int      MID { get; }
        double   ActionPrice { get; }
        String   ActionSince { get; }
        String   ActionTill { get; }
        Int64    SupplierID { get; }
        Int64    TST { get; }
        String   ModifyTime { get; }
        Int64    Flags { get; }
    }

    public interface IPaymentType
    {
        int Type { get; }
        String Description { get; }
        bool IsCashPayment { get; }
    }

    public interface IVATItem
    {
       int RecordNumber { get; }
       decimal VATValue { get; }
       string ValidSince { get; }
       string ValidTill { get; }
       Int64? TST { get; }
       String ModifyTime { get; }
       List<ICommonAttribute> Attributes { get; }
    }

    public interface IShop
    {
        int    Number { get; }
        string Text { get; }
        string Street { get; }
        string City { get; }
        string ZIP { get; }
        string PhoneNumber { get; }
        string CurrencyISOCode { get; }
        List<String> TopLines { get; }
        List<String> BottomLines { get; }
        Int64 TST { get; }
        String ModifyTime { get; }
        List<ICommonAttribute> Attributes { get; }
    }

    public interface ICodeListItem
    {
        String dataValue { get; }
        String displayValue { get; }
    }

    public enum CodeList
    {
        WayOfReturn,
        PayerType,
        InvoiceType,
        AccountingPeriode,
        REDTariffType,
        CallTarifType,
        SMSTariffType,
        DataTariffType
    }

    public interface IDataInterface
    {
        IAccount        Account { get; }
        IAccountUser    User { get; }

        UInt64 GetFutureNumber(int shop, int documentType, bool commit);
        List<IArticle>  Articles { get; }
        IEETItem FiscalizeDocument(IDocumentHeader document);
        void SaveDocument(IDocumentHeader document, IEETItem eetItem);
        List<IPaymentType> Payments { get; }
        List<IShop> Shops { get; }
        List<ICodeListItem> GetCodeList(CodeList cl);
    }


}