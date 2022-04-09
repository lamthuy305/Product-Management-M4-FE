let currentUser = localStorage.getItem('currentUser');
currentUser = JSON.parse(currentUser);// ep chuoi ve doi tuong
function getAllProduct(page) {
    let q = $('#search').val();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?q=${q}&page=${page}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (data) {
            let content = ``;
            let products = data.content;
            for (let i = 0; i < products.length; i++) {
                content += `  
        <tr>
        <td>${i + 1}</td>
        <td>${products[i].name}</td>
        <td>${products[i].price}</td>
        <td>${products[i].description}</td>
<!--        <td><img src="http://localhost:8080/image/${products[i].image}" height="140px" width="150px"></td>-->
        <td>${products[i].category == null ? '' : products[i].category.name}</td>
        <td><button class="btn btn-primary" data-target="#edit-product" data-toggle="modal"
                                        type="button" onclick="showEditProduct(${products[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteProduct(${products[i].id})"><i class="fa fa-trash"></i></button></td>
        </tr>`
            }
            $('#tableProduct').html(content);
            $('#displayPage').html(`<button class="btn btn-primary" id="first" onclick="getAllProduct(0)" style="margin-right: 10px">1</button><button class="btn btn-primary" id="backup" onclick="getAllProduct(${data.pageable.pageNumber}-1)">«</button>
             <span>Trang </span><span>${data.pageable.pageNumber + 1} / ${data.totalPages}</span>
                <button class="btn btn-primary" id="next" onclick="getAllProduct(${data.pageable.pageNumber}+1)">»</button>
                <button class="btn btn-primary" id="last" onclick="getAllProduct(${data.totalPages}-1)">${data.totalPages}</button>`);
            //điều kiện bỏ nút previous
            if (data.pageable.pageNumber === 0) {
                $("#backup").hide();
                $("#first").hide();
            }
            //điều kiện bỏ nút next
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                $("#next").hide();
                $("#last").hide();
            }
        }
    })
    event.preventDefault();
}

function createNewProduct() {
    event.preventDefault();

    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image')[0].files;
    let category = $('#category').val();
    let product = new FormData();
    product.append('name', name);
    product.append('price', price);
    product.append('description', description);
    product.append('category', category);
    let listImage = [];
    jQuery.each(image, function (i, file) {
        product.append('image[]', file);
    });

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/products',
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllProduct();
            showSuccessMessage('Tạo thành công!');
        },
        error: function (e) {


            showErrorMessage(e.message);
        }
    })
}


function showCreateProduct() {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (categories) {
            categories = categories.content;
            let content = `<option>Chọn danh mục sản phẩm</option>`
            for (let category of categories) {
                content += `<option value="${category.id}">${category.name}</option>`
            }
            $('#category').html(content);
        }
    })
}


function deleteProduct(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllProduct(0);
            showSuccessMessage('Xóa thành công!');
        },
        error: function () {
            showErrorMessage('Xóa lỗi');
        }
    })
}

function showDeleteProduct(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${id})" type="button" aria-label="Close" class="close" data-dismiss="modal">Xóa</button>`;
    $('#footer-delete').html(content);
}


$(document).ready(function () {
    if (currentUser != null) {
        getAllProduct();
    } else {
        location.href = '/product-management-font-end/pages/auth/login.html'
    }
})

function editProduct(id) {
    let name = $('#editName').val();
    let price = $('#editPrice').val();
    let description = $('#editDescription').val();
    let image = $('#editImage');
    let category = $('#editCategory').val();
    let product = new FormData();
    product.append('name', name);
    product.append('price', price);
    product.append('description', description);
    product.append('category', category);
    product.append('image', image.prop('files')[0]);

    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/products/${id}`,
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function () {
            getAllProduct(0);
            showSuccessMessage('Sửa thành công!');
        },
        error: function () {
            showErrorMessage('Sửa lỗi');
        }
    })
}

function showEditProduct(id) {

    $.ajax({
        type: "GET",
        url: `http://localhost:8080/products/${id}`,
        headers: {
            'Authorization': 'Bearer ' + currentUser.token
        },
        success: function (product) {
            $('#editName').val(product.name);
            $('#editPrice').val(product.price);
            $('#editDescription').val(product.description);
            // $('#editImage').val(product.image);

            $.ajax({
                type: 'GET',
                url: 'http://localhost:8080/categories',
                headers: {
                    'Authorization': 'Bearer ' + currentUser.token
                },
                success: function (categories) {
                    categories = categories.content;
                    let content = '';
                    if (product.category != null) {
                        content = `<option value="${product.category.id}">${product.category.name}</option>`;
                    } else {
                        content = `<option>Chọn danh mục sản phẩm</option>`;
                    }
                    for (let category of categories) {
                        content += `<option value="${category.id}">${category.name}</option>`
                    }
                    $('#editCategory').html(content);
                }
            })

            let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="editProduct(${id})" type="button" aria-label="Close" class="close" data-dismiss="modal">Chỉnh sửa</button>`;
            $('#edit-form').html(content);

        }
    })
}

function logout() {
    localStorage.removeItem("currentUser")
}