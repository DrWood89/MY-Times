$(document).ready(function () {

    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    initPage();

    function initPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
            .then(function (data) {
                if (data && data.length) {
                    renderArticles(data);
                } else {
                    renderEmpty();
                }
            });
    }

    function renderEmpty() {

        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>Would you like to browse available articles?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a href='/>Browse Articles</a></h4>",
                "</div>",
                "</div>"].join(""));
        articleContainer.append(emptyAlert);
    }

    function renderArticles(articles) {
        var articlePanels = [];
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

    function createPanel(articles) {
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                articles.headline,
                "<a class='btn btn-success save'>",
                "Save Article",
                "</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                articles.summary,
                "</div>",
                "</div>"].join(""));

        panel.data("_id", articles._id);
        return panel;
    }

    function handleArticleSave() {

        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;

        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        }).then(function (data) {
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleArticleScrape() {
        $.get("/api/fetch")
            .then(function (data) {
                initPage();
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
            });
    }
})