var globalTodayRate = 0.0;

$(document).ready(function () {
    // kod do date pickera 
    var running = false;

    var date_input = $('input[name="date"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var options = {
        format: 'dd/mm/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);


    getRates();

    // handle change event
    $("#date").on('change', function () {
        if (running == false) {
            // Get today's date
            var url = '';
            var day, month;
            var today = new Date();
            var inputDay = new Date($(this).val().substring(6, 10), $(this).val().substring(3, 5) - 1, $(this).val().substring(0, 2));
            // change running to handle event only once
            running = true;

            // remove alert if exists
            $('#alert').addClass('alert-display');
            $('#result-date').addClass('alert-display');

            // check if date is ok
            if (inputDay > today) {
                $('#alert').removeClass('alert-display');
            } else {
                day = inputDay.getDate();
                month = inputDay.getMonth() + 1;
                url = "https://api.fixer.io/latest?base=GBP&date=" + inputDay.getFullYear() + '-' + month + '-' + day;

                console.log(url);
                $.ajax({
                    url: url,
                    dataType: 'json',
                    success: function (resultJSON) {
                        // get rate in PLN 
                        $('#result-date').removeClass('alert-display');
                        console.log(resultJSON.rates.PLN);
                        $('#result-date p').html('Kurs danego dnia wynosił: <span>' + resultJSON.rates.PLN + '</span>');
                    },
                    onerror: function (msg) {
                        console.log(msg);
                    }
                });
            }
            // reset to handle event 
            setTimeout(function () {
                running = false;
            }, 1000);
        }


    })

});

function getRates() {
    var today = new Date();


    getTodayRate(today, 'rate-today');

    console.log('tydzien temu');
    today.setDate(today.getDate() - 7);
    getTodayRate(today, 'rate-week');

    console.log('miesiac temu');
    today.setDate(today.getDate() - 23);
    getTodayRate(today, 'rate-month');

}

function getTodayRate(inputToday, htmlObject) {
    var day, month;

    day = inputToday.getDate();
    month = inputToday.getMonth() + 1;
    url = "https://api.fixer.io/latest?base=GBP&date=" + inputToday.getFullYear() + '-' + month + '-' + day;

    console.log(url);
    $.ajax({
        url: url,
        dataType: 'json',
        success: function (resultJSON) {
            // get rate in PLN 
            var percentage = 0.00;
            console.log(resultJSON.rates.PLN);
            $('#' + htmlObject + ' p').html('Kurs funta: <span>' + resultJSON.rates.PLN + '</span>');

            if (htmlObject == 'rate-today') {
                globalTodayRate = resultJSON.rates.PLN;
                
                percentage = (globalTodayRate / 4.90)*100;
                if ( percentage >= 100 ) {
                    percentage = 100;
                    $('.progress-bar').removeClass('progress-bar-info');
                    $('.progress-bar').addClass('progress-bar-success');
                    $('.progress p').text('CZAS WYMIENIĆ PIENIĄŻKI!');
                }
                
                $('#summary .progress-bar').css('width', percentage + "%");
                // get date from yesterday and compare 
                inputToday.setDate(inputToday.getDate() - 1);
                day = inputToday.getDate();
                month = inputToday.getMonth() + 1;
                url = "https://api.fixer.io/latest?base=GBP&date=" + inputToday.getFullYear() + '-' + month + '-' + day;

                $.ajax({
                    url: url,
                    dataType: 'json',
                    success: function (resultJSON) {
                        if (globalTodayRate > resultJSON.rates.PLN) {
                            $('#today-icon').removeClass('fa fa-thumbs-down');
                            $('#today-icon').removeClass('fa fa-minus');
                            $('#today-icon').addClass('fa fa-thumbs-up');
                        } else if (globalTodayRate < resultJSON.rates.PLN) {

                            $('#today-icon').removeClass('fa fa-minus');
                            $('#today-icon').removeClass('fa fa-thumbs-up');
                            $('#today-icon').addClass('fa fa-thumbs-down');
                        } else {
                            $('#today-icon').removeClass('fa fa-thumbs-down');

                            $('#today-icon').removeClass('fa fa-thumbs-up');
                            $('#today-icon').addClass('fa fa-minus');
                        }
                    },
                    onerror: function (msg) {
                        console.log(msg);
                    }
                });

            } else {
                if (globalTodayRate > resultJSON.rates.PLN) {
                    $('#' + htmlObject + ' i').removeClass('fa fa-thumbs-down');
                    $('#' + htmlObject + ' i').removeClass('fa fa-minus');
                    $('#' + htmlObject + ' i').addClass('fa fa-thumbs-up');
                } else if (globalTodayRate < resultJSON.rates.PLN) {

                    $('#' + htmlObject + ' i').removeClass('fa fa-minus');
                    $('#' + htmlObject + ' i').removeClass('fa fa-thumbs-up');
                    $('#' + htmlObject + ' i').addClass('fa fa-thumbs-down');
                } else {
                    $('#' + htmlObject + ' i').removeClass('fa fa-thumbs-down');
                    $('#' + htmlObject + ' i').removeClass('fa fa-thumbs-up');
                    $('#' + htmlObject + ' i').addClass('fa fa-minus');
                }
            }
        },
        onerror: function (msg) {
            console.log(msg);
        }
    });
}
