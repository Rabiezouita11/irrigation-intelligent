$(function () {
    "use strict";
    // Google Analytics Dashboard
    $(document).ready(function(){
        var chart = c3.generate({
            bindto: '#Google-Analytics-Dashboard', // id of chart wrapper
            data: {
                columns: [
                    // each columns data
                    ['data1', 11, 8, 22, 18, 19, 6, 17, 11, 17, 32, 9, 12],
                    ['data2', 7, 7, 5, 7, 9, 12, 8, 22, 18, 19, 6, 17],
                    ['data3', 1, 13, 15, 8, 9, 12, 8, 18, 11, 17, 6, 12],
                ],
                type: 'bar', // default type of chart
                colors: {
                    'data1': Iconic.colors["theme-cyan1"],
                    'data2': Iconic.colors["theme-cyan2"],
                    'data2': Iconic.colors["theme-cyan3"]
                },
                names: {
                    // name of each serie
                    'data1': 'Electricity',
                    'data2': 'Water',
                    'data3': 'Gas',
                }
            },
            axis: {
                x: {
                    type: 'category',
                    // name of each category
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
                },
            },
            bar: {
                width: 5
            },
            legend: {
                show: true, //hide legend
            },
            padding: {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            },
        });
    });

    //  Day/Night Use
    $(document).ready(function(){
        var chart = c3.generate({
            bindto: '#DayNight-Use', // id of chart wrapper
            data: {
                columns: [
                    // each columns data
                    ['data1', 65],
                    ['data2', 35],
                ],
                type: 'donut', // default type of chart
                colors: {
                    'data1': Iconic.colors["theme-cyan1"],
                    'data2': Iconic.colors["theme-cyan2"],
                },
                names: {
                    // name of each serie
                    'data1': 'Night',
                    'data2': 'Day',
                }
            },
            axis: {
            },
            legend: {
                show: true, //hide legend
            },
            padding: {
                bottom: 0,
                top: 0
            },
        });
    });
});