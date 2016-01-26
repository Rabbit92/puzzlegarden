
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
        <title>Gr&atilde;dina Puzzle</title>

        <link rel="stylesheet" type="text/css" href="public/build/css/app-0f97de8d.css">
    </head>
    <body>
        <nav id="main-nav" class="navbar navbar-default">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="Home">Gradina Puzzle</a>
                </div>

                <!-- Collect the nav links, forms, and other content for toggling -->
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav">
                        <li class=""><a href="http://garden.borina.ro/despre">Despre Noi</a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="Login">Login</a></li>
                    </ul>
                </div><!-- /.navbar-collapse -->
            </div><!-- /.container-fluid -->
        </nav>        <div id="garden-background">
            <svg>
            <rect x="0" y="0" width="200%" height="200%" fill="url(#gridPattern)" id="bgRectangle" />
            </svg>
        </div>
        <div id="garden-container">
            <svg>
            </svg>
            <div id="garden-select"></div>
        </div>
        <div id="garden-price">
            <span class="total-label">Preț Execuție: <span class="total-number">0</span></span>
            <button type="button" class="details-btn">Detalii</button>
            <div class="details-container hidden">
                <div class="details-content">
                    <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <table class="details-grid">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Descriere</th>
                                <th>Cantitate</th>
                                <th>Preț</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="template" data-template>
                                <td data-field="image"></td>
                                <td data-field="name"></td>
                                <td>
                                    <span data-field="quantity"></span>
                                    <span data-field="unit"></span>
                                </td>
                                <td><span data-field="price">0</span> RON</td>
                            </tr>
                        </tbody>
                    </table>
                    <form class="order-form" action="Order" method="POST">
                        <button type="submit" class="btn btn-primary">
                            Cumpără
                        </button>
                    </form>
                </div>
            </div>
        </div>
        <div id="garden-toolbox">
            <div id="module-buttons">

            </div>
            <a href="javascript:;" class="toggle-contents">
                <i class="glyphicon glyphicon-menu-hamburger"></i>
            </a>
            <div class="contents">
                <div id="module-categories">
                    <ul>
                        <li class="">
                            <i class="icon-category icon-category-conifere"></i>                            <button type="button" class="fetch-modules" data-category_id="5">Conifere</button>
                        </li>
                        <li class="">
                            <i class="icon-category icon-category-foioase"></i>                            <button type="button" class="fetch-modules" data-category_id="4">Foioase</button>
                        </li>
                        <li class="">
                            <i class="icon-category icon-category-graminee"></i>                            <button type="button" class="fetch-modules" data-category_id="6">Graminee</button>
                        </li>
                        <li class="">
                            <i class="icon-category icon-category-legume"></i>                            <button type="button" class="fetch-modules" data-category_id="7">Legume</button>
                        </li>
                        <li class="">
                            <i class="icon-category icon-category-lumina"></i>                            <a href="javascript:;" role="button" data-target="#categoryChildren1" data-level="0"
                                                                                                             class="expand-category">Lumina</a>
                            <ul id="categoryChildren1" class="subcategories">
                                <li class="">
                                    <button type="button" class="fetch-modules" data-category_id="12"><img src="http://garden.borina.ro/images/fit/365073695f586226e376bef62c4f950759?width=150"/></button>
                                </li>
                                <li class="">
                                    <button type="button" class="fetch-modules" data-category_id="13"><img src="http://garden.borina.ro/images/fit/93b7668c59128bd74d7b0504552defb203?width=150"/></button>
                                </li>
                                <li class="">
                                    <button type="button" class="fetch-modules" data-category_id="14"><img src="http://garden.borina.ro/images/fit/947dd7a5ad4fe5bc20dd57f9a2ddc44d50?width=150"/></button>
                                </li>
                                <li class="">
                                    <button type="button" class="fetch-modules" data-category_id="15"><img src="http://garden.borina.ro/images/fit/9564eef27f58cf49b7500f4e7ff955a445?width=150"/></button>
                                </li>
                            </ul>
                        </li>
                        <li class="">
                            <i class="icon-category icon-category-semiumbra"></i>                            <button type="button" class="fetch-modules" data-category_id="3">Semiumbra</button>
                        </li>
                        <li class="">
                            <i class="icon-category icon-category-umbra"></i>                            <button type="button" class="fetch-modules" data-category_id="2">Umbra</button>
                        </li>
                    </ul>
                </div>
                <div id="center-stage-backdrop"></div>
                <div id="tool-container">
                </div>
            </div>
        </div>
        <div id="garden-zoom" class="btn-group">
            <button type="button" data-zoom="in" class="btn btn-default btn-lg">
                <i class="glyphicon glyphicon-zoom-in"></i>
            </button>
            <button type="button" data-zoom="out" class="btn btn-default btn-lg">
                <i class="glyphicon glyphicon-zoom-out"></i>

            </button>
        </div>
        <svg>
        <defs>
    <pattern id="materialPattern1" x="0" y="0" patternUnits="userSpaceOnUse" height="1670" width="1635">
        <image x="0" y="0" width="1635" height="1670" xlink:href="http://garden.borina.ro/images/full/17530db0749cfcf28c2e1aa4e8bd0bbf2?"></image>
    </pattern>
    <pattern id="materialPattern2" x="0" y="0" patternUnits="userSpaceOnUse" height="2000" width="2000">
        <image x="0" y="0" width="2000" height="2000" xlink:href="http://garden.borina.ro/images/full/974d0e6161988b30df761146c228768833?"></image>
    </pattern>
    <pattern id="gridPattern" x="0" y="0" patternUnits="userSpaceOnUse" height="100" width="100">
        <path d="M0 0L0 100" class="path10cm" />
        <path d="M0 0L100 0" class="path10cm" />
        <path d="M10 0L10 100" class="path10cm" />
        <path d="M0 10L100 10" class="path10cm" />
        <path d="M20 0L20 100" class="path10cm" />
        <path d="M0 20L100 20" class="path10cm" />
        <path d="M30 0L30 100" class="path10cm" />
        <path d="M0 30L100 30" class="path10cm" />
        <path d="M40 0L40 100" class="path10cm" />
        <path d="M0 40L100 40" class="path10cm" />
        <path d="M50 0L50 100" class="path10cm" />
        <path d="M0 50L100 50" class="path10cm" />
        <path d="M60 0L60 100" class="path10cm" />
        <path d="M0 60L100 60" class="path10cm" />
        <path d="M70 0L70 100" class="path10cm" />
        <path d="M0 70L100 70" class="path10cm" />
        <path d="M80 0L80 100" class="path10cm" />
        <path d="M0 80L100 80" class="path10cm" />
        <path d="M90 0L90 100" class="path10cm" />
        <path d="M0 90L100 90" class="path10cm" />
        <rect x="0" y="0" width="100" height="100" class="rect1m" />
    </pattern>
    </defs>
    </svg>
    <script type="text/javascript">
        var IMAGES_URL = '/images';
        var PUZZLE_URL = '/puzzle';
        var SoilTypes = [{"id": 1, "created_at": "2015-09-08 11:16:03", "updated_at": "2015-09-13 12:30:46", "name": "Gazon", "top_image_hash": "17530db0749cfcf28c2e1aa4e8bd0bbf2", "can_plant": 0, "price": 13.5, "top_image": {"id": 2, "created_at": "2015-09-08 11:46:10", "updated_at": "2015-09-08 11:46:10", "original": "gazon.jpg", "hash": "17530db0749cfcf28c2e1aa4e8bd0bbf2", "extension": "jpeg", "width": 1635, "height": 1670}}, {"id": 2, "created_at": "2016-01-12 19:43:50", "updated_at": "2016-01-12 19:46:52", "name": "Pamant", "top_image_hash": "974d0e6161988b30df761146c228768833", "can_plant": 0, "price": 80, "top_image": {"id": 98, "created_at": "2016-01-12 19:46:52", "updated_at": "2016-01-12 19:46:52", "original": "pamant copy.jpg", "hash": "974d0e6161988b30df761146c228768833", "extension": "jpeg", "width": 2000, "height": 2000}}];
    </script>
    <script type="text/javascript" src="public/js/main.js"></script>
</body>
</html>
