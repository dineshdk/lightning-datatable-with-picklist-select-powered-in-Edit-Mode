({
    getContacts : function(component) {
        var action = component.get("c.getContactList");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS" ) {
                var resultData = response.getReturnValue();
                console.log('resultData..'+resultData);
                component.set("v.data", resultData);
               
            }
        });
        $A.enqueueAction(action);
    },
   
    getColumnAndAction : function(component) {
        var actions = [
           
            {label: 'Edit', name: 'edit'},
           
        ];
        component.set('v.columns', [
            {label: 'First Name', fieldName: 'FirstName', type: 'text', sortable:true},
            {label: 'Last Name', fieldName: 'LastName', type: 'text', sortable:true},
            {label: 'Phone', fieldName: 'MobilePhone', type: 'phone', sortable:true},
            {label: 'Email Type', fieldName: 'Email_Type__c', type: 'picklist', sortable:true},
            {label: 'Email', fieldName: 'Email', type: 'email', sortable:true},
            {type: 'action', typeAttributes: { rowActions: actions } } 
        ]);
    },
        
    editContactRecord : function(component, event) {
        
       component.set('v.isProcessing', true);
               
        var row = event.getParam('row');
        var recordId = row.Id;
        
        component.set('v.recId',recordId);
        
        var action = component.get("c.getColumnData");
        action.setParams({
            "recId": recordId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS" ) {
                component.set('v.isProcessing', false);
                var resultData = response.getReturnValue();
                console.log('resultData..'+resultData);
                component.set("v.list", resultData);
                component.set("v.emailtypeVal",resultData.Email_Type__c);
                console.log('resultData.Email_Type__c'+resultData.Email_Type__c);
                 var cmpTarget = component.find('editDialog');
        var cmpBack = component.find('dialogBack');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpBack, 'slds-backdrop--open'); 
                 
        
            }});
        $A.enqueueAction(action);
        
        
    },
    
    saveModal: function(component,event, helper) {
        
         var isValidEmail = true; 
        var isValidEmailType = true; 
        var emailField = component.find("Email");
        var emailFieldValue = emailField.get("v.value");
        var regExpEmailformat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;  
       
        var emailTypeField = component.find('pl');
        var emailType = component.find('pl').get("v.value");
                
        if(!$A.util.isEmpty(emailFieldValue)){   
            if(emailFieldValue.match(regExpEmailformat)){               
                               
                if(typeof emailType === 'undefined' || emailType ===('--- None ---'))
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        title : 'Error Message',
                        message:'Please enter Email Type along with Email Address',
                        duration:' 5000',
                        type: 'error'
                    });
                    toastEvent.fire();
                    isValidEmailType = false; 
                } 
            }
            else {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Error Message',
                    message:'Please enter correct email address',
                    duration:' 5000',
                    type: 'error'
                });
                toastEvent.fire();
                isValidEmail = false; 
            }
         
        }
        
        if(isValidEmail && isValidEmailType){
           
             var theMap = component.get("v.conMap");
             var a = "Email_Type__c";
             if(emailType ===('--- None ---') )theMap[a]= '';
            else
              theMap[a]=  emailType;
            
             theMap["email"]=emailFieldValue;
            
            var action = component.get("c.updateContact");
        action.setParams({
            'm1' : theMap,
            'recId' : component.get("v.recId")
        });
        action.setCallback(this,function(response) {
            var state = response.getState();
            console.log('update sucess');
            component.set("v.picklistOpts",null);
        component.set("v.list",null);
             component.set("v.emailType",null);
            if (state === "SUCCESS") {
                 $A.get("e.force:refreshView").fire();
                 helper.getContacts(component);
            helper.showToast({
                        "title": "Record Update",
                        "type": "success",
                        "message": " Contact Record Updated"
                    });
                   
                } else{ //if update got failed
                    helper.showToast({
                        "title": "Error!!",
                        "type": "error",
                        "message": "Error in update"
                    });
                } 
        component.set("v.picklistOpts",null);
        component.set("v.list",null);
        var cmpTarget = component.find('editDialog');
        var cmpBack = component.find('dialogBack');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        $A.util.removeClass(cmpBack, 'slds-backdrop--open'); 
        
        }
               );
            $A.enqueueAction(action);
    }
        
     },
    
    fetchPickListVal: function(component, fieldName, picklistOptsAttributeName) {
        var action = component.get("c.getselectOptions");
        action.setParams({
            "objObject": component.get("v.objInfoForPicklistValues"),
            "fld": 'Email_Type__c'
        });
        var opts = ["--- None ---"];
        action.setCallback(this, function(response) {
            console.log('response length '+response.getReturnValue());
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
               
                var emailType = component.find('pl').get("v.value");
                
                console.log('emailType value...'+emailType);
                
                for (var i = 0; i < allValues.length; i++) 
                {
                    
                    if(emailType === allValues[i] )
                    {
                        
                   console.log('opts...'+emailType);
                   console.log('allValues..'+allValues[i]);
                        
                        var element = allValues[i];
                         console.log('splice from..'+element);
                        var a = allValues[i-1];
                         console.log('splice to..'+typeof (a));
                        opts.splice(i, 1);
                        opts.splice(0, 0, element);
                        if(typeof (a) != "undefined")opts.splice(i, 0, a);
                        else
                           opts.splice(i+1, 0, "--- None ---"); 
                        
                            
                       console.log('splice final..'+opts);
                     
                    }
                   else
                     opts.push(allValues[i]);
                    
                    
                }
                
                component.set("v.picklistOpts", opts);
                console.log('response none added..'+component.get("v.picklistOpts"));
                
            }});
        $A.enqueueAction(action);
        
        
    },
    
   showToast : function(params){
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent){
            toastEvent.setParams(params);
            toastEvent.fire();
        } else{
            alert(params.message);
        }
    },
})