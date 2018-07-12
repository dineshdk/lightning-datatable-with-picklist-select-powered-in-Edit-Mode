({
    doInit : function(component, event, helper) {
       
        helper.getColumnAndAction(component);
        helper.getContacts(component);
    },
    
    saveEditModal : function(component, event, helper) {
        helper.saveModal(component,event, helper);
       },
    
    closeEditModal: function(component, event, helper) {
        
        component.set("v.picklistOpts",null);
        component.set("v.list",null);
        var cmpTarget = component.find('editDialog');
        var cmpBack = component.find('dialogBack');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        $A.util.removeClass(cmpBack, 'slds-backdrop--open'); 
     
    },
 
    handleRowAction: function (component, event, helper) {
        var action = event.getParam('action');
        switch (action.name) {
            case 'edit':
                helper.editContactRecord(component, event);
                helper.fetchPickListVal(component, 'Email_Type__c', 'picklistOpts');
                break;           
        }
    },
    
   
})