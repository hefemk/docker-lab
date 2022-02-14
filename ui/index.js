jQuery(function () {
    $.ajax({
        url: '/name',
        method: 'GET',
        success: function (res) {
            $('#labName').html(res);
        },
        error: function (err) { console.log(err) },
    });

    $('button#btnStress2').on('click', () => {
        $.ajax({
            url: '/stress2',
            method: 'POST',
            dataType: 'json',
            data: {
            },
            success: function (res) {
            },
            error: function (err) { console.log(err) },
        });
    });

    $('button#btnEnv').on('click', () => {
        $.ajax({
            url: '/env',
            method: 'GET',
            type: 'json',
            success: function (res) {
                $('#env').html(null);
                $('#env').append('<ul>');
                Object.keys(res).forEach(key => {
                    $('#env').append('<li>' + key + ': ' + res[key] + '</li>');
                });
                $('#env').append('</ul>');
            },
            error: function (err) { console.log(err) },
        });
    });

    $('button#btnGetFileList').on('click', () => {
        $.ajax({
            url: '/files',
            method: 'GET',
            type: 'json',
            success: function (res) {
                $('ul#fileList').html(null);
                res.forEach(fileName => {
                    $('ul#fileList').append('<li><a href="files?path=' + fileName + '">' + fileName + '</a></li>');
                });
            },
            error: function (err) { console.log(err) },
        });
    });

});
