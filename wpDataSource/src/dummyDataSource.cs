using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using wpCommon;
using PortalInterface;
using CloudCommon;

namespace wpDataSource
{
    public class Article: IArticle
    {
        public Guid UID { get; set; }
        public string VART { get; set; }
        public string GTIN { get; set; }
        public string AGN { get; set; }
        public string LinkedVART { get; set; }
        public string Decription { get; set; }
        public decimal RetailPrice { get; set; }
        public decimal PurchasePrice { get; set; }
        public int VariantIndex1 { get; set; }
        public int VariantIndex2 { get; set; }
        public int VariantIndex3 { get; set; }
        public string VariantText1 { get; set; }
        public string VariantText2 { get; set; }
        public string VariantText3 { get; set; }
        public int VATID { get; set; }
        public int MID { get; set; }
        public double ActionPrice { get; set; }
        public String ActionSince { get; set; }
        public String ActionTill { get; set; }
        public Int64 SupplierID { get; set; }
        public Int64 TST { get; set; }
        public String ModifyTime { get; set; }
        public Int64 Flags { get; set; }

        public Article()
        {

        }
    }

    public class PaymentType: IPaymentType
    {
        public int Type { get; set; }
        public String Description { get; set; }
        public bool IsCashPayment { get; set; }

        public PaymentType()
        {

        }
    }

    public class VATItem: IVATItem
    {
        public int RecordNumber { get; set; }
        public decimal VATValue { get; set; }
        public string ValidSince { get; set; }
        public string ValidTill { get; set; }
        public Int64? TST { get; set; }
        public String ModifyTime { get; set; }
        public List<ICommonAttribute> Attributes { get; set; }

        public VATItem()
        {

        }
    }

    public class Shop: IShop
    {
        public int Number { get; set; }
        public string Text { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string ZIP { get; set; }
        public string PhoneNumber { get; set; }
        public string CurrencyISOCode { get; set; }
        public List<String> TopLines { get; set; }
        public List<String> BottomLines { get; set; }
        public Int64 TST { get; set; }
        public String ModifyTime { get; set; }
        public List<ICommonAttribute> Attributes { get; set; }

        public Shop()
        {

        }
    }

    public class CodeListItem: ICodeListItem
    {
        public String dataValue { get; set; }
        public String displayValue { get; set; }

        public CodeListItem()
        {

        }

        public CodeListItem( String dataVal, String displayVal )
        {
            dataValue = dataVal;
            displayValue = displayVal;
        }
    }

    public class EETItem: IEETItem
    {
        public DateTime eetActionTime { get; set; }
        public int errorCode { get; set; }
        public String fik { get; set; }
        public String pkp { get; set; }
        public String bkp { get; set; }
        public String errorMessage { get; set; }
        public String eetFullRequest { get; set; }
        public String eetFullResponse { get; set; }
        public String eetUUID { get; set; }
    }

    public class DummyDataInterface: IDataInterface
    {
        public IAccount Account
        {
            get
            {
                return new AccountModel() { CompanyName = "Kolovrat", PhoneNumber = "1111231231", City = "Zlín", Country = "Česká Republika", EmailAddress = "jan.sobotik@sunseed.cz", IN = "1231312312", TIN = "CZ1231231312321", CurrencyISOCode = "CZK", VATPayer = true };
            }
        }

        public IAccountUser User
        {
            get
            {
                return new AccountUserModel() { EmailAddress = "user@user.cz", FirstName = "Karel", LastName = "Matějovský", ID = 2, UserName = "karel.matejovsky" };
            }
        }

        public UInt64 GetFutureNumber(int shop, int documentType, bool commit)
        {
            return 1;
        }

        public List<IArticle> Articles
        {
            get
            {
                List<IArticle> res;

                res = new List<IArticle>();
                res.Add(new Article() { UID = Guid.NewGuid(), VART="0001", VATID = 1, AGN="001", GTIN="0001", Decription="Artikl 01", RetailPrice = 0 });
                res.Add(new Article() { UID = Guid.NewGuid(), VART = "0002", VATID = 1, AGN = "001", GTIN = "0002", Decription = "Artikl 02", RetailPrice = 0 });
                res.Add(new Article() { UID = Guid.NewGuid(), VART = "0003", VATID = 1, AGN = "001", GTIN = "0003", Decription = "Artikl 03", RetailPrice = 0 });
                res.Add(new Article() { UID = Guid.NewGuid(), VART = "0004", VATID = 1, AGN = "001", GTIN = "0004", Decription = "Artikl 04", RetailPrice = 0 });

                return res;
            }
        }

        public IEETItem FiscalizeDocument(IDocumentHeader document)
        {
            return new EETItem();
        }

        public void SaveDocument(IDocumentHeader document, IEETItem eetItem)
        {

        }

        public List<IPaymentType> Payments
        {
            get
            {
                List<IPaymentType> res;

                res = new List<IPaymentType>();
                res.Add(new PaymentType() { Type = 0, Description = "Hotově", IsCashPayment = true });
                res.Add(new PaymentType() { Type = 1, Description = "Kartou", IsCashPayment = false });
                res.Add(new PaymentType() { Type = 2, Description = "Faktura", IsCashPayment = false });
                return res;
            }
        }

        public List<IShop> Shops
        {
            get
            {
                List<IShop> res;

                res = new List<IShop>();
                res.Add(new Shop() { Number = 1, Text = "Kolovrat Zlín", City = "Zlín", PhoneNumber = "1122334455", Street = "Kvítková 5" , ZIP = "763 15" });
                res.Add(new Shop() { Number = 2, Text = "Kolovrat Praha", City = "Praha", PhoneNumber = "1122334455", Street = "Václavské Náměstí 48", ZIP = "101 01" });
                return res;
            }
        }

        public List<ICodeListItem> GetCodeList(CodeList cl)
        {
            List<ICodeListItem> res = new List<ICodeListItem>();

            switch (cl)
            {
                case CodeList.AccountingPeriode:
                    res.Add(new CodeListItem("4", "4"));
                    res.Add(new CodeListItem("10", "10"));
                    res.Add(new CodeListItem("16", "16"));
                    res.Add(new CodeListItem("20", "20"));
                    res.Add(new CodeListItem("25", "25"));
                    break;
                case CodeList.CallTarifType:
                    res.Add(new CodeListItem("1", "Neomezeně VF"));
                    res.Add(new CodeListItem("2", "Neomezeně"));
                    res.Add(new CodeListItem("3", "0 minut"));
                    res.Add(new CodeListItem("4", "50 minut"));
                    res.Add(new CodeListItem("5", "100 minut"));
                    res.Add(new CodeListItem("6", "200 minut"));
                    res.Add(new CodeListItem("7", "300 minut"));
                    res.Add(new CodeListItem("8", "600 minut"));
                    break;
                case CodeList.DataTariffType:
                    res.Add(new CodeListItem("1", "Mobilní připojení 500MB"));
                    res.Add(new CodeListItem("2", "Mobilní připojení 1GB"));
                    res.Add(new CodeListItem("3", "Mobilní připojení 1.5GB"));
                    res.Add(new CodeListItem("4", "Mobilní připojení 4GB"));
                    res.Add(new CodeListItem("5", "Mobilní připojení 10GB"));
                    res.Add(new CodeListItem("6", "Připonení do služby standard"));
                    res.Add(new CodeListItem("7", "Připonení do služby super"));
                    res.Add(new CodeListItem("8", "Připonení do služby premium"));
                    break;
                case CodeList.InvoiceType:
                    res.Add(new CodeListItem("1", "Elektronický"));
                    res.Add(new CodeListItem("2", "Papírový"));
                    break;
                case CodeList.PayerType:
                    res.Add(new CodeListItem("1", "PrePaid"));
                    res.Add(new CodeListItem("2", "PostPaid"));
                    break;
                case CodeList.REDTariffType:
                    res.Add(new CodeListItem("1", "Smart 50"));
                    res.Add(new CodeListItem("2", "Smart 100"));
                    res.Add(new CodeListItem("3", "Smart 250"));
                    res.Add(new CodeListItem("4", "RED LTE"));
                    res.Add(new CodeListItem("5", "RED LTE Super"));
                    res.Add(new CodeListItem("6", "RED LTE Premium"));
                    res.Add(new CodeListItem("7", "Business Smart 50"));
                    res.Add(new CodeListItem("8", "Business Smart 100"));
                    break;
                case CodeList.SMSTariffType:
                    res.Add(new CodeListItem("1", "Neomezeně VF"));
                    res.Add(new CodeListItem("2", "Neomezeně"));
                    res.Add(new CodeListItem("3", "0 SMS"));
                    res.Add(new CodeListItem("4", "50 SMS"));
                    res.Add(new CodeListItem("5", "100 SMS"));
                    res.Add(new CodeListItem("6", "200 SMS"));
                    res.Add(new CodeListItem("7", "300 SMS"));
                    break;
                case CodeList.WayOfReturn:
                    res.Add(new CodeListItem("1", "Faktura"));
                    res.Add(new CodeListItem("2", "Poštou"));
                    break;
            }

            return res;
        }
    }
}
