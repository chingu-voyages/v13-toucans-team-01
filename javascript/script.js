// CALL TO ACTION MODAL SIGNUP FORM //

var modal = document.getElementById('form');

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


//BUDGET MODULE
var budgetModule=(function(){
    
    //Expense function constructor
    var Expense=function(id,description,value){
        
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
        
    };
    
    //Income function constructor
    var Income=function(id,description,value){
        
        this.id=id;
        this.description=description;
        this.value=value;
        
    };
    
    //The Expense percentage calculate prototype
    Expense.prototype.calculatePercentage=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100);
        }
        else{
            this.percentage=-1;
        }
        
    };
    //To get the income percentage prototype
    Expense.prototype.getPercentage=function(){
      return this.percentage;  
    };
    
    
    
    
    //Calculate Total Budget Function
    
    var calculateTotal=function(type){
        
    var sum=0;
        
        data.allItems[type].forEach(function(curr){
            sum+=curr.value;
        });
    
        if(type==='exp')
            data.totals.expn=sum;
        else if(type==='inc')
            data.totals.incm=sum;
        
    };
    
    //data about incomes and expenses
    var data={
        allItems:{
            exp:[],//exp array which will contain item objects
            inc:[]//inc array which will contain item objects
        },
        totals:{
            incm:0,
            expn:0,
            budget:0,
            percentage:-1
        }
  };
    
    
    //Data to be passed to the controller
    return{
         //returning add item method to budgetModule
                         //FROM THE CONTROLLER CALLED
        addItem:function(type,des,val){
             var newItem;
        var ID;
            //Assigning values to the id
            if(data.allItems[type].length>0){
                ID=data.allItems[type][data.allItems[type].length-1].id+1;//Id gets the value of the number after last element
                                                                         //[1,2,3,4] then id gets 5,which comes after 4 and the elements in the arrays are all id's
                                                                          //.id means  look carefully to understand it
            }
            else{
                ID=0;
            }
            //creating a new object which contains the id ,description and value of the item
            if(type==='inc'){
               newItem=new Income(ID,des,val);
            }
            else if(type==='exp'){
                newItem=new Expense(ID,des,val);
                
            }
            //pushing the new item to the array of either expense or income array of the data object,thus creating an array of items objects
            //eg.exp[{newitem[0]},{newitem[1]},and so on]
            data.allItems[type].push(newItem);
    
            
            //returning the new item with id which was currently passed after clicking the button 
            return newItem;
             
            
        }
        ,
        calculateBudget:function(){
            //Calling calculate total function
            calculateTotal('inc');
            calculateTotal('exp');
            //Calculating the total budget
             data.totals.budget=data.totals.incm-data.totals.expn;
            //Calculating percentage
            if(data.totals.incm>0)
                {
                    data.totals.percentage=Math.round((data.totals.expn/data.totals.incm)*100);
                }
            else{
                data.totals.percentage=-1;
            }
            
            
  },
        //Returning the budget to the controller
        
        getBudget:function(){
    
            return{
                totalInc:data.totals.incm,
                totalExp:data.totals.expn,
                totalBudget:data.totals.budget,
                totalPercentage:data.totals.percentage
                }
        },

        // to delete the item from the data structure
        deleteItem:function(type,id){
            var idArray;
            //To get the id from all array objects
            //Element is the current array element i.ea arr[0]etc..
        idArray=  data.allItems[type].map(function(element){
            return element.id; 
            });
            var index=idArray.indexOf(id);
            //To remove the object with the received id
            if(index!==-1){
            data.allItems[type].splice(index,1);
            }
            
        },
        calculatePercentages:function(){
            data.allItems.exp.forEach(function(cur){
                cur.calculatePercentage(data.totals.incm);
            
            });
            
        },
        getPercentages:function(){
        var percentages=    data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return percentages;
            
        },
        
         //For checking the data object
       testing:function(){
        console.log(data);
    }
    }
})();




//UI MODULE
var uiModule=(function(){
    
    //Creating a storage for the classes
    
  var DOMstrings={
        inputType :'.add__type',
        inputDescription :'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
       budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
      expenseLabel:'.budget__expenses--value',
      percentageLabel:'.budget__expenses--percentage',
      container:'.container',
      expPerLabel:'.item__percentage',
      dateLabel:'.budget__title--month'
    };
    
    //Display the sign function ,whether the object is income or expense label
    
    var formatNumber=function(num,type){
        var numSplit,int ,dec;
    num=Math.abs(num);
        //Convert number to two fixed decimal places
        num=num.toFixed(2);
        //Returns the array of integral and number part
        
        numSplit=num.split('.');
        int =numSplit[0];
        dec=numSplit[1];
        
        if(int.length>3){
            
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
        }
        
        return (type==='exp'?'-':'+')+''+int+'.'+dec;
        
     
    
        
        
    };
       //Creating a personal forEach for each one of the nodes
         var nodesForEach=function(list,callback){
              for(var i=0;i<list.length;i++){
                  callback(list[i],i);
              }
         };
    
    
    
    return {
        //takes the values entered by the user
        getInput : function(){
            return {//returns an object
              type :document.querySelector(DOMstrings.inputType).value,
              description :document.querySelector(DOMstrings.inputDescription).value,
                //converting the input value to a float
               value :parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        //To return the DOM strings to the controller
        getDomStrings: function(){
            return DOMstrings;
        }
        ,
         //Receives the newItem object and it's type whether expense or income and acts accordingly
        addListItem:function(obj,type){
            var html;
            var newHtml;
            var element;
            if(type==='inc')
                {     
                      //Stores the class of income__list and where the income will appear if entered
                    element=DOMstrings.incomeContainer;
                    
                    //Storing the html to be printed inside html.And % the propeties which we want to change with the object one's called by function
                   html= '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                    
                }
            else if(type==='exp')
                {  //Stores the class of expense__list and where the expense will appear if entered
                    element=DOMstrings.expenseContainer;
                    html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                    
                }
                    
               //replacing the id of the container and the html inside it using .replace().Id will be unique for every entry even after it's deleted
             newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            
            //Inserting our HTML INTO DOM
       document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
            
        },
        deleteBudget:function(itemId){
            var element=document.getElementById(itemId);
            element.parentNode.removeChild(element);
              
        },
        clearInput:function(){
            var fields,fieldsArr;
            //Passes a list to the fields ,which is similar to an array but doesn't have its method access
            fields=document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);
            //We use the call method and pass the fields as this,which now has acess to the slice of Array function Constructor
            fieldsArr=Array.prototype.slice.call(fields);
            //Now we use to forEach method to set every of the element in the array to a value of null(i.e fieldsarr[0]='' which is the class value)
            
            fieldsArr.forEach(function(curr,ind,arr){
                //The value is the same as that we use in document .querySelector
                curr.value="";
                
            });
            fieldsArr[0].focus();
        },
        //To display the budget to the user,this function is to be passed to the ctrl object
        displayBudget:function(obj)
        {     //The object is passed from getbudget
            var type;
            
            (obj.totalBudget>0)?type='inc':type='exp';

            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.totalBudget,type);
             document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');          
          document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
 
            if(obj.totalPercentage>0){
            document.querySelector(DOMstrings.percentageLabel).textContent=obj.totalPercentage+"%";
            }
            else {
                 document.querySelector(DOMstrings.percentageLabel).textContent="----"
            }
            
        }
        ,
        //To display the percentages we got from the budget controller
        displayPercentages:function(percentages){
               
             //Returns a list of nodes to the label and selects them sequence-wise
            var labels=document.querySelectorAll(DOMstrings.expPerLabel);
            
            
          //It is called by the callback^||
         nodesForEach(labels,function(curr,index){
                      if(percentages[index]>0){
                curr.innerHTML=percentages[index]+'%';
         }
            else{curr.innerHTML="----";}
                      
            
        });
        },
        displayMonth:function(){
            
            var now=new Date();
            var year=now.getFullYear();
            var month=now.getMonth();
            var months=['January','February','March','April','May','June','July','August','September','October','November','December'];
            document.querySelector(DOMstrings.dateLabel).innerHTML=months[month]+' '+year;
            
        }
        ,
        //To change the border color function
        changeBorder:function(){
            
            var colors=document.querySelectorAll(
            DOMstrings.inputType +',' +
                DOMstrings.inputDescription + ','
                + DOMstrings.inputValue );
            nodesForEach(colors,function(ele){
                ele.classList.toggle('red-focus');
            })
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        }
    }
})();




//Controller Module

var controllerModule=(function(bdgtMod,uiMod){
    
    
    //setting up event listener calling function
    var setUpEventListener=function(){
        
        //Setting up the dom strings
        
        var dom=uiMod.getDomStrings();
        
        //Click Event Listener for calculating budget
        
        document.querySelector(dom.inputBtn).addEventListener('click',ctrlInputAsked);
       
        //Enter press event listener to get the input from the user
      
        document.addEventListener('keypress',function(element){
        if(element.keyCode===13 || element.which === 13)
            {
                ctrlInputAsked();
            }
            
         //Setting up the event handler for deleting income and expenses  
            document.querySelector(dom.container).addEventListener('click',ctrlDeleteItem);
            
            //Event listener to change color as we select income or expense option
            document.querySelector(dom.inputType).addEventListener('change', uiModule.changeBorder);
    });
    };
    //Event Listener Function Ends here
    
    
    

    //The update budget function
    var updateBudget=function(){
        //1.Calculate the budget
         bdgtMod.calculateBudget();
        //2.Return the budget to the controller
        var budgetObject=bdgtMod.getBudget();
        
         //3.Display the budget to the user
          uiMod.displayBudget(budgetObject);
    };
    
    //To update the expense percentages
    var budgetPercentage=function(){
        
        //1.Calculate Percentages
        
        bdgtMod.calculatePercentages();
        
        //2.Read the percentages from the Budget Controller
        
        var percentages=bdgtMod.getPercentages();
         console.log(percentages);
        //3.Update the budget to the UI
         uiMod.displayPercentages(percentages);
        
    };

    
    //After event listener execution function
    var ctrlInputAsked=function(){
       var input;
        var newItem;
      //1.Get data from user 
    input=uiMod.getInput();
        //Validating if the input fields are correctly filled and we pass valid arguments into the module
        
        if(input.description !=="" && !isNaN(input.value) &&input.value>0){
            //2.Update the data using budget Module
      
    newItem=bdgtMod.addItem(input.type,input.description,input.value);//New Item receives the object newItem with id from budget module
      
      //3.Display item in UI
      
        uiMod.addListItem(newItem,input.type);
      
        
        //4.Clear The items of the array
         
        //Calling the clear input method
        uiMod.clearInput();
        
        //5.Calling the update budget Method to calculate the budget and display it
        updateBudget();
            
        //6.Calling the percentage Calculator function if an item is added
            
            budgetPercentage();
        }
    };
    
    
    
    //The control Delete Item Method to delete the fields
    
   var ctrlDeleteItem=function(element){
       
       var itemID,id,splitID,delID,delType;
       //Go to the parent node which contains the id
       itemID=element.target.parentNode.parentNode.parentNode.parentNode.id;
       
       if(itemID)
           {
            splitID=itemID.split('-');
            delID=parseInt(splitID[1]);
            delType=(splitID[0]);
           }
       
       
       //1.Delete the Items
        bdgtMod.deleteItem(delType,delID);
       
       
       //2.Remove the items from UI
         uiMod.deleteBudget(itemID);
       
       //3.Update the budget
          updateBudget();
        
       //6.Calling the percentage Calculator function if an item is deleted
            
            budgetPercentage();
       
   }
    
   return {
         //passing this method to the control item
       init :function(){
           console.log("Application Started");
           uiMod.displayBudget({
               totalInc:0,
                totalExp:0,
                totalBudget:0,
                totalPercentage:0});
           setUpEventListener();//fires up the event listener
           //Calling the date function'
           uiMod.displayMonth();
       }
   };
    
    
    
}(budgetModule,uiModule));

controllerModule.init();
