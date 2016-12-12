using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using wpDataSource;
using wpCommon;


namespace WebPos.Models
{
    public class Customer
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Company { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string City { get; set; }
        public string ZIP { get; set; }
        public string IC { get; set; }
        public string DIC { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
    }

    public class Store
    {
        public string Name { get; set; }
        public string Street { get; set; }
        public string Number { get; set; }
        public string City { get; set; }
        public string ZIP { get; set; }
        public string IC { get; set; }
        public string DIC { get; set; }
    }

    public class Item
    {
        public string GUID { get; set; }
        public string Description { get; set; }
        public string Quantity { get; set; }
        public string Price { get; set; }
        public string VAT { get; set; }
        public string Total { get; set; }
    }

    public class Payment
    {
        public string Type { get; set; }
        public string Cash { get; set; }
        public string Value { get; set; }
        public string Code { get; set; }
    }

    public class DefaultModel
    {
        public Store Store { get; set; }
        public Customer Customer { get; set; }
        public Item Item1 { get; set; }
        public Item Item2 { get; set; }
        public Item Item3 { get; set; }
        public Item Item4 { get; set; }
        public List<Payment> Payments { get; set; }

        public List<IShop> shopList;
        public List<IArticle> articleList;
        public List<IVATItem> vatList;
        public List<IPaymentType> paymentTypeList;

        public DefaultModel()
        {
            var dataSource = new DummyDataInterface();
            shopList = dataSource.Shops;
            articleList = dataSource.Articles;
            //vatList = dataSource.VATs;
            paymentTypeList = dataSource.Payments;
        }
    }
}