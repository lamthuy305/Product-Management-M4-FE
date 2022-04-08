function getCategory(page) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/categories?page=${page}`,
        success: function (data) {
            let content = `
        <thead>        
        <tr>
        <th>#</th>
        <th>Tên Category</th>
        <th colspan="2"></th>
        </tr>
        </thead>        
        <tbody>`;
            let categories = data.content;
            for (let i = 0; i < categories.length; i++) {
                content += `  
        <tr>
        <td>${i + 1}</td>
        <td>${categories[i].name}</td>
        <td><button class="btn btn-primary" data-target="#edit-product" data-toggle="modal"
                                        type="button" onclick="showEditCategory(${categories[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteCategory(${categories[i].id})"><i class="fa fa-trash"></i></button></td>
        </tr>`
            }
            content += '</tbody>'
            $('#tableAll').html(content);
            $('#displayPage').html(`<button class="btn btn-primary" id="first" onclick="getCategory(0)" style="margin-right: 10px">1</i></button><button class="btn btn-primary" id="backup" onclick="getCategory(${data.pageable.pageNumber}-1)">«</i></button>
             <span>Trang </span><span>${data.pageable.pageNumber + 1} / ${data.totalPages}</span>
                <button class="btn btn-primary" id="next" onclick="getCategory(${data.pageable.pageNumber}+1)">»</button>
                <button class="btn btn-primary" id="last" onclick="getCategory(${data.totalPages}-1)">${data.totalPages}</button>`);
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