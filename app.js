var express = require('express');
var path= require('path');
var port = process.env.PORT || 3000 ;
var app = express();
var mongoose=require('mongoose');
var _=require('underscore');
var Movie=require('./models/movie');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/mooc',{useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '1mb'}));
app.use('/static',serveStatic('public'));
app.locals.moment=require('moment');


//設置視圖的根目錄
app.set('views','./views/pages');
//設置默認的模板引擎
app.set('view engine','jade');
//監聽上設端口
app.listen(port);
console.log('mooc start!'+ port);

//以下是路由
//index page
app.get('/',function (req, res) {
    Movie.fetch(function (err, movies) {
       if(err){
           console.log(err)
       }
       res.render('index',{
            title:'mooc首頁',
            movies:movies
        })
    });
});

//admin update movie
app.get('/admin/update/:id',function (req, res) {
    var id=req.params.id;
    if(id){
        Movie.findById(id,function (err, movie) {
            res.render('admin',{
                title:'mooc update!',
                movie:movie
            })
        })
    }
});

//admin post movie
app.post('/admin/movie/new',function (req,res) {
    console.log(req.body);
    var id = req.body.movie._id;
    var movieObj =req.body.movie;
    var _movie;
    if(id !== 'undefined'){
        Movie.findById(id,function (err, movie) {
            if (err){
                console.log(err)
            }
            _movie=_.extend(movie,movieObj);
            _movie.save(function (err, movie) {
                if(err){
                    console.log(err)
                }
                res.redirect('/movie/'+movie._id);
            })
        })
    }else {
        _movie=new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            lan:movieObj.lan,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        });
        _movie.save(function (err, movie) {
            if(err){
                console.log(err)
            }
            res.redirect('/movie/'+movie._id);
        })
    }
});

//list page
app.get('/admin/list',function (req, res) {
    Movie.fetch(function (err, movies) {
        if(err){
            console.log(err)
        }
        res.render('list',{
            title:'mooc列表',
            movies:movies
        })
    });
});



//detail page
app.get('/movie/:id',function (req, res) {
    var id =req.params.id;
    Movie.findById(id,function (err,movie) {
        res.render('detail',{
            title:'mooc詳情頁',
            movie:movie
        })
    })

});

//admin page
app.get('/admin/movie',function (req, res) {
    res.render('admin',{
        title:'mooc後台',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});


//list delete
app.delete('/admin/list',function (req, res) {
    var id=req.query.id;
    if(id){
        Movie.remove({_id:id},function (err, movie) {
            if(err){
                console.log(err)
            }else {
                res.json({success:1})
            }
        })
    }
})