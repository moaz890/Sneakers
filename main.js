class Product {
    constructor (price, offer, image) {
        this.price = price;
        this.offer = offer;
        this.image = image;
    }
}

class Order {
    constructor (product, id, quantity){
        if (product instanceof Product){

            this.product = product;
        }else{

            try {
                throw new Error("Product Must Be Product Object");
            }catch(e){
                console.log(e.message);
            }
        }
        if (typeof quantity === "number"){
            this.quantity = quantity;
        }else {
            try {
                throw new Error("Quantity Must Be Number");
            }catch(e){
                console.log(e.message);
            }
        }
        this.id = id;
    }

    total () {
        return this.product.offer > 0 ? this.quantity * this.product.price * (this.product.offer / 100) : this.quantity * this.product.price;
    }
}

class UI {
    constructor () {
        this.cart = document.querySelector(".cart");
        this.productsList = document.querySelector(".products");
        this.quantity = document.querySelector(".quantity strong");
        this.plusIcon = document.querySelector(".quntity .plus");
        this.minusIcon = document.querySelector(".quantity .minus");
    }

    prependData() {
        if (!localStorage.getItem("cart")){
            localStorage.setItem("cart", JSON.stringify([]));
        }
    }
    fillList (data) {
        this.checkEmptyList(data);
        if (data.length > 0){
            data.forEach((order) => {
                this.createOrder(order);
            });
        }
    }

    createOrder(order){
        let item = document.createElement("li");
        item.classList.add("flex");
        item.dataset.index = order.id;
        item.innerHTML =
        `
            <div class="small"><img src="${order.product.image}" alt=""></div>
            <div class="text-mini">
                <h4 >Fall Limited Edition Sneakers</h4>
                <h4 >$${order.product.price * order.product.offer / 100} x ${order.quantity} <strong class="total">${order.product.price * order.quantity * order.product.offer / 100}</strong></h4>
            </div>
            <div class="icon delete-btn"><img src="images/icon-delete.svg" alt=""></div>
        `;
        this.productsList.appendChild(item);
    }

    addOrder (data) {
        if (+this.quantity.textContent > 0) {
            let image = document.querySelector(".swiper-slide-active a").href;
            let product = new Product(250, 50, image);
            let order = new Order(product, data.length + 1 ,+this.quantity.textContent);
            data.push(order);
        }
    }

    deleteOrder(order, data) {
        order.remove();
        this.checkEmptyList(data);
    }

    checkEmptyList (data) {
        if (data.length > 0) {
            if(this.cart.classList.contains("empty")){
                this.cart.classList.remove("empty");
                this.cart.classList.add("filled");
            }
        }else {
            if (this.cart.classList.contains("filled")) {
                this.cart.classList.remove("filled");
                this.cart.classList.add("empty");
            }
        }
    }
    increaseQuantity () {
        +this.quantity.textContent++; 
    }
    decreaseQuantity(){
        +this.quantity.textContent > 0 ? +this.quantity.textContent-- : null; 
    }
}


const swiperEl = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    // If we need pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return `
          <div class="${className} small">
            <img src="images/image-product-${index + 1}-thumbnail.jpg">
            </div>
        `;
      },
    },
    // Navigation arrow
});

document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function (e) {
        e.preventDefault();
    });
});


function eventListeners() {
    const controlPanel = document.querySelector(".control");
    const CartList = document.querySelector(".products");
    const addBtn = document.querySelector(".add-btn");
    const shopIcon = document.querySelector(".shop");
    
    const ui = new UI();
    ui.prependData();
    
    let data = JSON.parse(localStorage.getItem("cart")); 
    ui.fillList(data);
    
    shopIcon.addEventListener("click", function (e) {
        if(e.target.classList.contains("icon-image")){
            shopIcon.classList.toggle("display-cart");
        }
    });

    addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (+ui.quantity.textContent > 0){
            ui.addOrder(data);
            ui.createOrder(data[data.length - 1]);
            localStorage.setItem("cart", JSON.stringify(data));
            ui.quantity.textContent = 0;
            ui.checkEmptyList(data);
        }
    });

    controlPanel.addEventListener("click", function (e) {
        e.preventDefault();
        if (e.target.closest("a") && e.target.closest("a").classList.contains("plus")){
            ui.increaseQuantity();
        }
        if (e.target.closest("a") && e.target.closest("a").classList.contains("minus")){
            ui.decreaseQuantity();
        }
    });
    
    CartList.addEventListener("click", function (e) {
        e.preventDefault();
        if (e.target.closest(".delete-btn")){
            
            let order = e.target.closest("li");
            order.remove();
            
            data = data.filter((ord) => {
                return +order.dataset.index !== ord.id;
            });

            data.map((item) => {
                return item.id > +order.dataset.index ? item.id - 1: item.id;
            });

            localStorage.setItem("cart", JSON.stringify(data));
            ui.checkEmptyList(data);
        }
    });
}

document.addEventListener("DOMContentLoaded", eventListeners);