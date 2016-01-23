
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
        <title>Grădina Puzzle</title>

        <link rel="stylesheet" type="text/css" href="public/css/public-b6bf74bc.css">
            </head>
    <body>
        
        <div class="container">
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
</nav>            <div class="col-xs-12">
                <div class="row">
    <div class="col-md-6">
        <form method="POST" action="Login">
    <input type="hidden" name="_token" value="6sQwHFaCuFdndh4TcgkdckH5BIewOpJ6Ml3BYoOQ">

    <div class="form-group">
        <label for="login-email"> Email </label>
        <input type="email" name="login-email" value="" class="form-control" id="login-email">
    </div>

    <div>
        <label for="login-password"> Parolă </label>
        <input type="password" name="login-password" id="login-password" class="form-control">
    </div>

    <div class="checkbox">
        <label>
            <input type="checkbox" name="remember"> Ține-mă logat
        </label>
    </div>

    <div class="form-group">
        <button type="submit" class="btn btn-primary">Login</button>
    </div>
</form>    </div>
    <div class="col-md-6">
        <form method="POST" action="Register">
    

    <div class="form-group">
        <label for="firstname">Name mic</label>
        <input type="text" name="firstname" value="" id="firstname" class="form-control">
    </div>

    <div class="form-group">
        <label for="lastname">Name de familie</label>
        <input type="text" name="lastname" value="" id="lastname" class="form-control">
    </div>

    <div class="form-group">
        <label for="email"> Email </label>
        <input type="email" name="email" value="" autocomplete="off" class="form-control" id="register-email">
    </div>

    <div class="form-group">
        <label for="password"> Parolă </label>
        <input type="password" name="password" autocomplete="off" id="register-password" class="form-control">
    </div>

    <div class="form-group">
        <button type="submit" class="btn-default btn">Înregistrează</button>
    </div>
</form>    </div>
</div>
            </div>
        </div>

            </body>
</html>
