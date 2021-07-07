class User {
    constructor(data){
        this.id=data.id
        this.name=data.name
        this.email=data.email
        this.address=data.address
        this.phone=data.phone
        this.user=data
    }
}
let length=0
class Contacts {
    constructor(){
       this.dataContacts= JSON.parse(localStorage.getItem('dataContactsLocal')) || [] 
    }
    add(user){ 
        this.dataContacts.push(user)
        length=this.dataContacts.length
        conApp.render()
    }
    remove(id){
        this.dataContacts.forEach(elem=>{
            if(elem.id==id){
                this.dataContacts.splice(elem.id, 1)
                conApp.render()
            }
        })
    }
    edit(id){
        let that=this
        this.dataContacts.forEach(elem=>{
            if(elem.id==id){
                let mainModalWindowUser=document.createElement('div')
                mainModalWindowUser.classList.add('main-modal')
                let modalWindowUser=document.createElement('div')
                modalWindowUser.classList.add('modal')
                modalWindowUser.innerHTML=`
                    <div>
                        <p>Lorem</p>
                        <input type="text" class="modalName" placeholder='Name' value='${elem.name}'> 
                        <input type="email" class="modalEmail" placeholder='Email' value='${elem.email}'>
                        <input type="text" class="modalAddress" placeholder='Address' value='${elem.address}'>
                        <input type="tel" class="modalPhone" placeholder='Phone' value='${elem.phone}'>
                        <button class="btnChange">Change</button>
                        <button class="btnCancel">Cancel</button>
                    </div>
                `
                let modalName=modalWindowUser.querySelector('.modalName')
                let modalEmail=modalWindowUser.querySelector('.modalEmail')
                let modalAddress=modalWindowUser.querySelector('.modalAddress')
                let modalPhone=modalWindowUser.querySelector('.modalPhone')

                modalWindowUser.querySelector('.btnChange').addEventListener('click', function(){
                    that.dataContacts[elem.id].name=modalName.value
                    that.dataContacts[elem.id].email=modalEmail.value
                    that.dataContacts[elem.id].address=modalAddress.value
                    that.dataContacts[elem.id].phone=modalPhone.value
                    document.querySelector('.main-modal').remove()
                    conApp.render()
                })
                modalWindowUser.querySelector('.btnCancel').addEventListener('click', function(){
                    mainModalWindowUser.remove()
                })
                mainModalWindowUser.appendChild(modalWindowUser)
                document.body.appendChild(mainModalWindowUser)
            }
        }) 
    }
}
class ContactsApp extends Contacts{
    constructor(data){
        super(data)
    }
    app(){  //отрисовка главного контейнера
        let mainContainer=document.createElement('div')
        let container=document.createElement('div')
        container.classList.add('contacts')
        container.innerHTML=`
            <div class="form">
                <p>New contact</p>
                <input type="text" class="inputName" placeholder='Name'> 
                <input type="email" class="inputEmail" placeholder='Email'>
                <input type="text" class="inputAddress" placeholder='Address'>
                <input type="tel" class="inputPhone" placeholder='Phone'>
                <button class="dtnForm">add</button>
            </div>  
        `
        let formName=container.querySelector('.inputName')
        let formEmail=container.querySelector('.inputEmail')
        let formAddress=container.querySelector('.inputAddress')
        let formPhone=container.querySelector('.inputPhone')
        let formBtn=container.querySelector('.dtnForm')

        formBtn.addEventListener('click', function(){
            if (!formName.value || !formPhone.value) {
                if(!formName.value && !formPhone.value) {
                    formName.classList.add('red')
                    formPhone.classList.add('red')
                }else if(!formName.value){formName.classList.add('red')}else{formPhone.classList.add('red')}
            } else {
                conApp.onAdd({id: length, name:formName.value, email:formEmail.value, address:formAddress.value, phone:formPhone.value})
                let inputs=document.querySelectorAll('input')
                inputs.forEach(elem=> {
                    elem.value =''
                    elem.classList.remove('red')
                })
            }
        })
        mainContainer.appendChild(container)

        let contactsList=document.createElement('div')
        contactsList.classList.add('list')

        mainContainer.appendChild(contactsList)
        document.body.appendChild(mainContainer)
        if(this.dataContacts) conApp.render()
    }
    onAdd(data){
        let user=new User(data)
        conApp.add(user)
    }
    render(){ //отрисовка списка контактов
        document.cookie='storageExpiration=storageExpiration; max-age=864000'
        localStorage.setItem('dataContactsLocal', JSON.stringify(this.dataContacts))
        if(!document.cookie=='storageExpiration=storageExpiration') {
            localStorage.removeItem('dataContactsLocal')
        }
        document.querySelector('.list').innerHTML=''
        this.dataContacts=this.dataContacts.map((item, index)=>{
            return {id:index, name:item.name, email:item.email, address:item.address, phone:item.phone}
        })
        this.dataContacts.forEach((elem, index)=>{
            let itemContact=document.createElement('div')
            itemContact.classList.add('items')
            itemContact.classList.add(`item-${elem.id}`)
            itemContact.innerHTML=`
                <div>${index+1}</div>
                <div>${elem.name}</div>
                <div>${elem.phone}</div>
                <div class="editBtn"><i class="fas fa-pencil-alt"></i></div>
                <div class="trashBtn"><i class="fas fa-trash"></i></div>
            `
            let trashBtn=itemContact.querySelector('.trashBtn')
            function userTrash(){
                conApp.remove(index, this.dataContacts)
            }
            trashBtn.addEventListener('click', userTrash)

            let editUser=itemContact.querySelector('.editBtn')
            function userEdit(){
                conApp.edit(index, this.dataContacts)
            }
            editUser.addEventListener('click', userEdit)
            document.querySelector('.list').appendChild(itemContact)
        })
    }
}

let conApp=new ContactsApp()
conApp.app()