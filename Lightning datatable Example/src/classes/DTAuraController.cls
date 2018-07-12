public class DTAuraController {
     
    //Get Contact List
    @AuraEnabled
    public static List<Contact> getContactList(String recordId){
    
       system.debug('recordId..'+recordId);
        List<Contact> conList = new List<Contact>();
        conList = [SELECT Id, firstname,lastname, Email, mobilephone, Email_Type__c FROM Contact where accountId = :recordId];
        return conList;
    }
    
    
     @AuraEnabled
    public static Contact getColumnData(String recId){
       
       system.debug('recId.'+recId);
        List<Contact> conList = new List<Contact>();
        Contact con = [SELECT Id, firstname,lastname, Email, mobilephone, Email_Type__c FROM Contact where Id = :recId];
         system.debug('recId.'+con);
        return con;
    }
     
     
     @AuraEnabled
    public static List < String > getselectOptions(sObject objObject, string fld) {
        List < String > allOpts = new list < String > ();
        Schema.sObjectType objType = objObject.getSObjectType();
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        map < String, Schema.SObjectField > fieldMap = objDescribe.fields.getMap();
        list < Schema.PicklistEntry > values = fieldMap.get(fld).getDescribe().getPickListValues();
        for (Schema.PicklistEntry a: values) {
            allOpts.add(a.getValue());
        }
        system.debug('allOpts.'+allOpts);
        return allOpts;
    }
    
      @AuraEnabled
    public static void updateContact(Map<String, String> m1, String recId)
    {
        String objName = 'contact' ;
        sobject sObj = Schema.getGlobalDescribe().get(objName).newSObject(recId) ;
        for(String m : m1.keyset())
        {
        sObj.put(m,m1.get(m)) ;
        }
        try
        {
        update sObj ;
        }
        catch(Exception ex){ 
        system.debug(ex);   
        }
    }
     
}