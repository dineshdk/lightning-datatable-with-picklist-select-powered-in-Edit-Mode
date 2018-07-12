@isTest
private class DTAuraController_test
{

static testMethod void testMethod1()
{
TestDataFactory.createAccounts(1);
Contact con =TestDataFactory.createContact(1)[0];
DTAuraController.getContactList(con.Id);
DTAuraController.getColumnData(con.Id);
Sobject sObj = (Sobject) con;
DTAuraController.getselectOptions(sObj,'Email_Type__c');
Map<String,String> m1 = new Map<String,String>();
m1.put('Email_Type__c','Other');
DTAuraController.updateContact(m1,con.Id);

}
}