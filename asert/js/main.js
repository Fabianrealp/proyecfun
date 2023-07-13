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
        const butonadd=product.quantity
        ?`<i class='bx bxs-plus-circle' id='${product.id}'></i>`
        :`<span class='soldout'>sold out</span>`
        html +=
            `<div class='product'>
        <div class="product_img">
        <img src="${product.image}" alt="imagen"/>
        </div>

        <div class="product_info">
          <h4>${product.name} <span><b>Stock</b>:${product.quantity}</span></h4>
          <h5>
            $${product.price}
            ${butonadd}
          </h5>
        </div>
        
        
    </div>`

    }
   
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
            printcarttoprodution(db)
            printtotal(db)
        }
    })

}
function printcarttoprodution(db) {
    const cartproductshtml = document.querySelector('.cart_products')

    let html = ''
    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount } = db.cart[product]
        html += `
        <div class="cart_product">
          <div class="cart_product--img">
            <img src="${image}" alt="imagen"/>
          </div> 
          <div class="cart_product_body">
              <h4>${name} | $${price}</h4>
              <p>Stock:${quantity}</P>
              <div class='cart_product_body_op' id='${id}'>
                <i class='bx bx-minus'></i>
                <i class='bx bx-plus'></i>
                <span>${amount} unit</span>
                <i class='bx bx-trash'></i>
             </div> 
          </div> 
        </div>`

    }


    cartproductshtml.innerHTML = html
}
function selectcanshoper(db) {
    const cartproductshtml = document.querySelector('.cart_products')

    cartproductshtml.addEventListener('click', function (e) {
        if (e.target.classList.contains('bx-plus')) {
            const id = parseInt(e.target.parentElement.id)
            const productfind = db.products.find(
                (product) => product.id === id
            )
            if (productfind.quantity === db.cart[productfind.id].amount) {
                return alert('no tenemos mas en bodega')
            }
            db.cart[id].amount++


        }
        if (e.target.classList.contains('bx-minus')) {
            const id = parseInt(e.target.parentElement.id)
            if (db.cart[id].amount === 1) {
                const response = confirm('estas seguro que quieres elminar el producto')
                if (!response) return
                delete db.cart[id]
            } else {
                db.cart[id].amount--
            }
        }
        if (e.target.classList.contains('bx-trash')) {
            const id = parseInt(e.target.parentElement.id)
            const response = confirm('estas seguro que quieres elminar el producto')
            if (!response) return
            delete db.cart[id]
        }


        window.localStorage.setItem('cart', JSON.stringify(db.cart))
        printcarttoprodution(db)
        printtotal(db)
    })

}
function printtotal(db) {
    const infototalhtml = document.querySelector('.info_total')
    const infoamounthtml = document.querySelector('.info_amount')
    let totalproduct = 0
    let amountproduct = 0
    for (const product in db.cart) {
        const { amount, price } = db.cart[product]
        totalproduct += price * amount
        amountproduct += amount
    }
    infototalhtml.textContent = '$' + totalproduct + '.00'
    infoamounthtml.textContent = amountproduct + ' units'
}
function hanletotal(db) {
    const btnbuyhtml = document.querySelector('.btn_buy')
    btnbuyhtml.addEventListener('click', function () {
        if (!Object.values(db.cart).length) return alert('debes añadir productos al carro de compras para comprar')
        const response = confirm('seguro que quieres comprar?')
        if (!response) return
        const currentproducts = []
        for (const product of db.products) {
            const productcart = db.cart[product.id]
            if (product.id === productcart?.id) {
                currentproducts.push({
                    ...product,
                    quantity: product.quantity - productcart.amount,
                })
            }
            else {
                currentproducts.push(product)
            }


        }

        db.products = currentproducts
        db.cart = {}
        window.localStorage.setItem('products', JSON.stringify(db.products))
        window.localStorage.setItem('cart', JSON.stringify(db.cart))
        printproduction(db)
        printtotal(db)
        printcarttoprodution(db)
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
    printcarttoprodution(db)
    selectcanshoper(db)
    printtotal(db)
    hanletotal(db)
}
main()