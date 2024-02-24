function redirectToBack() {
    window.location.href = 'start.html';
}
function redirectToStart() {
    window.location.href = 'start.html';
}
$(document).ready(function () {
    $('#addBookForm').submit(function (event) {
        event.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3002/addEmployee',
            data: formData,
            success: function (response) {
                alert('Book added successfully');
                $('#addBookForm')[0].reset();
            },
            error: function (xhr, status, error) {
                alert('Error: ' + error);
            }
        });
    });
});

$(document).ready(function () {
    $('.sort_by').change(function () {

        $.ajax({
            url: 'http://localhost:3002/addEmployee',
            type: 'GET',
            data: {
                page: 1,
                perPage: 5,
                sortby: $('.sort_by').val(),
                search: $('.search_value').val(),
            },
            success: function (response) {

                console.log(response);
                $('tbody').empty();
                response.limitedResults.forEach(function (book, index) {
                    if ($('.table').hasClass('admin')) {
                        appendBookData(book, 'booksTable tbody', index);
                    } else {
                        appendBookData(book, 'bookList', index);
                    }
                });
                $('.pagination').html(generatePaginationItems(response.totalResults))
                $('.pagination').find('li').first().addClass('active');
            },
            error: function (xhr, status, error) {

                console.error(status, error);
            }
        });
    });
});

$(document).on('click', '.search_btn', function () {
    $.ajax({
        url: 'http://localhost:3002/addEmployee',
        type: 'GET',
        data: {
            page: 1,
            perPage: 5,
            sortby: $('.sort_by').val(),
            search: $('.search_value').val(),
        },
        success: function (response) {

            console.log(response);
            $('tbody').empty();
            response.limitedResults.forEach(function (book, index) {
                if ($('.table').hasClass('admin')) {
                    appendBookData(book, 'booksTable tbody', index);
                } else {
                    appendBookData(book, 'bookList', index);
                }
            });
            $('.pagination').html(generatePaginationItems(response.totalResults))
            $('.pagination').find('li').first().addClass('active');
        },
        error: function (xhr, status, error) {

            console.error(status, error);
        }
    });
});

$(document).on('click', '.view_books_available', function () {

    if ($('#booksTable tbody').children().length == 0) {

        $.ajax({
            url: 'http://localhost:3002/addEmployee',
            method: 'GET',
            data: {
                page: 1,
                perPage: 5,
                sortby: $('.sort_by').val(),
                search: $('.search_value').val(),
            },
            success: function (response) {

                console.log('Paginated results:', response);
                $('tbody').empty();
                response.limitedResults.forEach(function (book, index) {
                    appendBookData(book, 'booksTable tbody', index);
                });
                $('.pagination').html(generatePaginationItems(response.totalResults))
                $('.pagination').find('li').first().addClass('active')

            },
            error: function (xhr, status, error) {

                console.error('Error fetching paginated results:', error);
            }
        });

    }

});

$(document).on('click', '.pagination li', function name() {
    var _this = $(this);
    var id = _this.find('span').attr('id')
    if (!$(this).hasClass('active')) {
        $('tbody').empty();
        paginate(id, 5);
        _this.addClass('active');
        _this.siblings().removeClass('active')
    }
});


$(document).on('click', '.delete-btn', function name(params) {
    var _this = $(this);
    var book_id = $(this).attr('data-bookid');
    $.ajax({
        url: 'http://localhost:3002/deleteEmployee/' + book_id,
        type: 'DELETE',
        success: function (response) {
            console.log(response.message);
            _this.parent().parent().remove();
        },
        error: function (xhr, status, error) {
            console.error('Error deleting book:', error);
        }
    });
});








function appendBookData(book, target, index) {

    if (target == 'bookList') {
        $('#' + target + '').append(
            `<tr id="${book.id}">
      <td>${index + 1}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.subject}</td>
      <td>${convertToDate(book.publishdate)}</td>
      <td>${book.availablebooks}</td>
     
    </tr>`
        );



    } else {
        $('#' + target + '').append(
            `<tr id="${book.id}">
      <td>${index + 1}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.subject}</td>
      <td>${convertToDate(book.publishdate)}</td>
      <td>${book.availablebooks}</td>
      <td><button class="btn btn-danger delete-btn" data-bookid="${book.id}">Delete</button></td>
    </tr>`
        );
    }


}

function convertToDate(dateString) {

    const date = new Date(dateString);

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

function generatePaginationItems(input) {

    const num = parseInt(input);

    if (num === 0) {
        $('tbody').html('<tr><td colspan="5">No results found</td></tr>');
    }

    const pages = Math.ceil(num / 5);

    let paginationItems = '';

    for (let i = 1; i <= pages; i++) {
        paginationItems += '<li class="page-item"><span class="page-link" id="' + i + '">' + i + '</span></li>';
    }

    return paginationItems;
}


function paginate(page, perPage) {
    $.ajax({
        url: 'http://localhost:3002/addEmployee',
        method: 'GET',
        data: {
            page: page,
            perPage: perPage,
            sortby: $('.sort_by').val(),
            search: $('.search_value').val(),
        },
        success: function (response) {

            console.log('Paginated results:', response);
            response.limitedResults.forEach(function (book, index) {
                if ($('.table').hasClass('admin')) {
                    appendBookData(book, 'booksTable tbody', index);
                } else {
                    appendBookData(book, 'bookList', index);
                }

            });

        },
        error: function (xhr, status, error) {

            console.error('Error fetching paginated results:', error);
        }
    });
}
