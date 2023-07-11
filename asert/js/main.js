async function getproducts() {
    try {
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        )
        const res = await data.json()
        window.localStorage.setItem("products", JSON.stringify(res))
        return res
    } catch (error) {
        console.log(error)
    }
}
function printproduction(db) {
    const productshtml = document.querySelector(".products")
    let html = ''
    for (const product of db.products) {
        html +=
            `<div class='product'>
        <div class="product_img">
        <img src="${product.image}" alt="imagen"/>
        </div>

        <div class="product_info">
          <h4>${product.name} <span><b>Stock</b>:${product.quantity}</span></h4>
          <h5>
            $${product.price}
            <i class='bx bxs-plus-circle' id='${product.id}'></i>
          </h5>
        </div>
        
        
    </div>`

    }
    console.log(html)
    productshtml.innerHTML = html
}
function cartshow() {
    const bxcarthtml = document.querySelector(".bx-cart")
    const carthtml = document.querySelector(".cart")
    bxcarthtml.addEventListener('click', function () {
        carthtml.classList.toggle('cart_show')
    })
}
function addtocartfromproducts(db) {
    const productshtml = document.querySelector('.products')

    productshtml.addEventListener('click', function (e) {

        if (e.target.classList.contains('bxs-plus-circle')) {

            const id = parseInt(e.target.id)
            let productfind = null
            for (const product of db.products) {
                if (product.id === id) {
                    productfind = product
                    break
                }
            }
            if (db.cart[productfind.id]) {
                if (productfind.quantity === db.cart[productfind.id].amount) return alert('No tenemos mas en bodega')
                db.cart[productfind.id].amount++

            }
            else {
                db.cart[productfind.id] = { ...productfind, amount: 1 }
            }
            window.localStorage.setItem("cart", JSON.stringify(db.cart))

        }
    })
}

async function main() {
    const db = {
        products: JSON.parse(window.localStorage.getItem("products")) || (await getproducts()),
        cart: JSON.parse(window.localStorage.getItem("cart")) || {}

    }

    printproduction(db)
    cartshow()
    addtocartfromproducts(db)
    const cartproductshtml = document.querySelector('.cart_products')
   
    let html = ''
    for (const product in db.cart) {
        const {quantity, price, name, image, id, amount } = db.cart[product]
        html += `
              <div class="cart_product">
              <div class="cart_product--img">
              <img src="${image}" alt="imagen"/>
            </div> 
            <div class="cart_product_body">
              <h4>${name} | $${price}</h4>
              <p>Stock:${quantity}</P>
              <div class='cart_product_body_op'>
                <i class='bx bx-minus'></i>
                <i class='bx bx-plus'></i>
                <i class='bx bx-trash'></i>
                <span>${amount} unit</span>
              </div> 
            </div> 
              </div>`
            
        }
    
    
  cartproductshtml.innerHTML=html
}
main()
