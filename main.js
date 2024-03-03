let title = document.getElementById("title")
let price = document.getElementById("price")
let taxes = document.getElementById("taxes")
let ads = document.getElementById("ads")
let discount = document.getElementById("discount")
let total = document.getElementById("total")
let count = document.getElementById("count")
let category = document.getElementById("category")
let submit = document.getElementById("submit")
let app = document.querySelector("body")
let table = document.querySelector("table")
let thead = document.querySelector("thead")
let mode = "create";
let tmp;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});


//* get total
function getTotal() {
  if (price.value != "") {
    let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
    total.innerHTML = result
    total.style.backgroundColor = "#0d6f04"
  }else{
    total.innerHTML = ""
    total.style.backgroundColor = "rgb(154, 38, 38)"
  }
}

//* create product
let dataPro;
if (localStorage.getItem("product")) {
  dataPro = JSON.parse(localStorage.getItem("product"))
}else{
  dataPro = []
}

submit.onclick = function () {
  let newPro = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value,
  } 
  if (title.value != "" && price.value != "") {
    if (mode == "create") {
      if (newPro.count >= 1 && newPro.count <= 500) {
        for (let i = 0; i < newPro.count; i++) {
          dataPro.push(newPro)
        }
        clearData()
        Toast.fire({
          icon: "success",
          title: "created successfully"
        });
      }else if(count.value == ""){
        dataPro.push(newPro)
        clearData()
        Toast.fire({
          icon: "success",
          title: "created successfully"
        });
      }
      else{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Max count is 500",
        });
      }
    }else{
      dataPro[tmp] = newPro;
      mode = "create";
      submit.innerHTML = "create";
      count.removeAttribute("disabled");
      clearData()
      Toast.fire({
        icon: "success",
        title: "updated successfully"
      });
    }
  }else{
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "you must to fill title and price",
    });
  }
  localStorage.setItem("product", JSON.stringify(dataPro))
  
  showData(dataPro)
}

//* clear inputs
function clearData() {
  title.value = ""
  price.value = ""
  taxes.value = ""
  ads.value = ""
  discount.value = ""
  total.innerHTML = ""
  total.style.backgroundColor = "rgb(154, 38, 38)"
  count.value = ""
  category.value = ""
}

//* read

function showData(dataPro) {
  getTotal()
  let table = ""
  dataPro.map((item,index)=>{
    table += `
    <tr>
      <td>${index+1}</td>
      <td>${item.title}</td>
      <td>${item.price}</td>
      <td>${item.taxes}</td>
      <td>${item.ads}</td>
      <td>${item.discount}</td>
      <td>${item.total}</td>
      <td>${item.category}</td>
      <td><button class="btn" onclick="updateData(${index})" id="update">update</button></td>
      <td><button class="btn" onclick="deleteData(${index})" id="delete">delete</button></td>
    </tr>
    `
  })
  document.getElementById("tbody").innerHTML = table;
  let btnDelete = document.getElementById("deleteAll")
  if (dataPro.length > 0) {
    btnDelete.innerHTML = `<button class="btn" onclick="deleteAll()">Delete All Products (${JSON.parse(localStorage.getItem("product")).length})</button>`
  }else{
    btnDelete.innerHTML = ""
  }
  
}
showData(dataPro)

//* delete

function deleteData(index) {
  dataPro.splice(index,1)
  localStorage.setItem("product", JSON.stringify(dataPro))
  showData(dataPro)
}
// delete all products
function deleteAll(){
  Swal.fire({
    title: "Are you sure to delete all?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      dataPro.splice(0)
      localStorage.setItem("product", JSON.stringify(dataPro))
      showData(dataPro)
      Swal.fire({
        title: "Deleted!",
        text: "Your products has been deleted.",
        icon: "success"
      });
    }
  });
}

//////

//////

//* update 
function updateData(index){
  title.value = dataPro[index].title
  price.value = dataPro[index].price
  taxes.value = dataPro[index].taxes
  ads.value = dataPro[index].ads
  discount.value = dataPro[index].discount
  getTotal()
  category.value = dataPro[index].category;
  count.setAttribute("disabled","");
  submit.innerHTML = "Update";
  title.focus()
  mode = "update";
  tmp = index;
  scroll({
    top:0,
    behavior: "smooth"
  })
}

//* search

// get mode of search
let searchMode = "Title"
let search = document.getElementById("search")
function getSearchMode(id) {
  if (id == "searchTitle") {
    searchMode = "Title"
  }else{
    searchMode = "Category"
  }
  search.placeholder = "Search By "+searchMode
  search.focus()
  search.value = ""
  showData(dataPro)
}


search.addEventListener("keyup", function (e) {
  search2(e.target.value, JSON.parse(localStorage.getItem("product")));
  if (e.target.value.trim() === "")
    showData(JSON.parse(localStorage.getItem("product")));
});

function search2(title, myArray) {
  if (searchMode == "Title") {
    let arr = myArray.filter(
      (item) => item.title.toLowerCase().indexOf(title.toLowerCase()) !== -1
    );
    showData(arr);
  }else if(searchMode == "Category"){
      let arr = myArray.filter(
        (item) => item.category.toLowerCase().indexOf(title.toLowerCase()) !== -1
      );
      showData(arr);
  }
}
const toggleBtn = document.querySelector(".toggle-btn"),
  lockIcon = document.querySelector(".icon i");
let getMode = localStorage.getItem("mode3");
if (getMode === "light-mode") {
  app.classList.add("light");
  table.classList.remove("table-dark");
  toggleBtn.classList.add("active");
  lockIcon.classList.replace("ri-moon-fill", "ri-sun-fill");
  thead.classList.replace("table-light","table-dark")
} else {
  toggleBtn.classList.remove("active");
}
toggleBtn.addEventListener("click", () => {
  toggleBtn.classList.toggle("active");
  app.classList.toggle("light");
  table.classList.toggle("table-dark");
  if(thead.classList == "table-light"){
    thead.classList.replace("table-light","table-dark")
  }else{
    thead.classList.replace("table-dark","table-light")
  }
  if (!app.classList.contains("light")) {
    localStorage.setItem("mode3", "dark-mode");
  } else {
    localStorage.setItem("mode3", "light-mode");
  }
  if (toggleBtn.classList.contains("active")) {
    lockIcon.classList.replace("ri-moon-fill", "ri-sun-fill");
  } else lockIcon.classList.replace("ri-sun-fill", "ri-moon-fill");
});
