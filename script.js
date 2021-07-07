const Modal = {
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