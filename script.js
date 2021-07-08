//objeto modal
const Modal = {
    //podemos utilizar a funçao toogle
    open(){
        //abrir modal
        //adicionar a classe active ao modal
        document.querySelector('.modal-overlay')
        .classList.add('active');
    },
    close(){
        //fechar modal
        //retirar a classe active do modal
        document.querySelector('.modal-overlay')
        .classList.remove('active');
    }
}

//Eu preciso somar as entradas
//Depois somar as saídas
//E remover das entradas o valor das saída
//Tendo assim o total

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions",JSON.stringify(transactions))
    }
}


const Transaction = {
    all: [],
    add(transaction){
        Transaction.all.push(transaction)
        App.reload();
    },
    remove(index){
        //pegar a posição do array
        Transaction.all.splice(index, 1);
        App.reload();
    },
    incomes(){
        // somar as entradas
        let income = 0;
        Transaction.all.forEach(transaction =>{
            if(transaction.amount > 0){
                income += transaction.amount;
            }
        })
       // let amount = Utils.formatCurrency(income);
        return income;
    },
    expenses(){
        //somar as saídas
        let expense = 0;
        Transaction.all.forEach(transaction =>{
            if(transaction.amount < 0){
                expense += transaction.amount;
            }
        })
       // let amount = Utils.formatCurrency(expense);
        return expense;
    },
    total(){
        //entradas - saidas 
        let total = Transaction.incomes() + Transaction.expenses();
        return total;
    }    
}

//pegar transações do meu objeto transactions e colocar no html
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index){      
        //adicionar transação
        //innerHTML (mostrar html ou receber html)
        console.log(transaction);
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction);
        tr.dataset.index = index;
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index){       
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        //codigo html
        const amount = Utils.formatCurrency(transaction.amount);
        const html = `                 
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="imagem de menos">
            </td>           
        `
        return html
    },

    updateBalance(){
        document
            .getElementById("incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document
            .getElementById("expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expenses());
        document
            .getElementById("totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total());
    },
    clearTransaction(){
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100;
        return value;
    },
    formatDate(date){        
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "";
        value = String(value).replace(/\D/g, "");
        value = Number(value) /100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
       return signal + value;
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateField(){
        const {description, amount, date} = Form.getValues();
        //limpeza dos espaços vazios
        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos");
        }
        console.log(Form.getValues());
    },
    formatValues(){
        let {description, amount, date} = Form.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

       return {
           description,
           amount,
           date
       }
    },
    saveTransaction(transaction){
        Transaction.add(transaction);
    },
    clearFields(){
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },
    submit(event){
        //interrompe o comportamento padrao do formulario
        event.preventDefault();

        try{
            Form.validateField();
            const transaction = Form.formatValues();
            Transaction.add(transaction);
            Form.clearFields();
            Modal.close();
        }catch(error){
            alert(error.message);
        }       

    }
}


const App = {
    init(){
        Transaction.all.forEach(DOM.addTransaction);
        DOM.updateBalance();
        Storage.set(Transaction.all);
    },
    reload(){
        DOM.clearTransaction();
        App.init();
    },
}
App.init();

