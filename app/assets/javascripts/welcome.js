$(function(){
  blueimp.Gallery(

    document.getElementById('links').getElementsByTagName('a'),
    {
        container: '#blueimp-gallery-carousel',
        carousel: true,
        stretchImages: 'cover'
    }
  );

})
