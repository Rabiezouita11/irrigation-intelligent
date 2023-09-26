$(document).ready(function() {
    $('.gallery').mauGallery({
        columns: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 4
        },
        lightBox: true,
        lightboxId: 'myAwesomeLightbox',
        showTags: true,
        tagsPosition: 'top'
    });
});