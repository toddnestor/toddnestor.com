<?php
session_start();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="description" content="Todd Nestor is a freelance web developer skilled in PHP, MySQL, JavaScript, CSS, Ruby on Rails, and many other technologies.">
    <title>Todd Nestor | Web Developer</title>
    <link rel="stylesheet" href="css/normalize.css">
    <!--
        <link href='http://fonts.googleapis.com/css?family=Changa+One|Open+Sans:400italic,700italic,400,700,800' rel='stylesheet' type='text/css'>
    -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/responsive.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  </head>
  <body>
    <header>
      <a href="index.html" id="logo">
        <h1>Todd Nestor</h1>
        <h2>Web Developer</h2>
      </a>
      <nav>
        <ul>
          <li><a href="index.html">Portfolio</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html" class="selected">Contact</a></li>
        </ul>
      </nav>
    </header>
    <div id="wrapper">
        <section id="primary">
          <h3>General Information</h3>
          <p>I am looking to do web development work, whether it is just creating a simple website or building a full-fledged web application.  I can utilize any of the technologies I mentioned on the <a href="about.html">about page</a>, and am willing to learn new technologies that need to be used in your project.</p>
          <p>I am available for full-time, part-time, or even just freelance work.  Feel free to contact me whenever you need!</p>
        </section>
        <section id="secondary">
          <h3>Contact Details</h3>
          <ul class="contact-info">
            <li class="phone"><a href="tel:15034469916">(503) 446-9916</a></li>
            <li class="phone"><a href="tel:+8615210842461">+86 152 1084 2461</a></li>
            <li class="email"><a href="mailto:todd.nestor@gmail.com">todd.nestor@gmail.com</a></li>
            <li class="twitter"><a href="http://twitter.com/intent/tweet?screen_name=toddnestor">@toddnestor</a></li>
          </ul>
        </section>
        <section id="tertiary">
          <h3>Contact Form</h3>
          <?php	echo isset($_GET['sent']) ? "<h4 class=\"message-sent\">Your message was sent!</h4>":""; ?>
          <?php	echo isset($_GET['error']) ? "<h4 class=\"message-sent\">You must fill out the complete form to submit a message!</h4>":""; ?>
          <?php	echo isset($_GET['spam']) ? "<h4 class=\"message-sent\">You appear to be submitting spam, please don't do that.</h4>":""; ?>
          <?php	echo isset($_GET['email']) ? "<h4 class=\"message-sent\">You must use a valid e-mail address.</h4>":""; ?>
        
          <p>I&rsquo;d love to hear from you! Complete the form to send me an e-mail.</p>
          
          <form method="post" action="contact-process.php">
            
            <table>
              <tr>
                <th>
                    <label for="name">Name</label>
                </th>
                <td>
                    <input <?php echo isset($_SESSION['name']) ? "value=\"" . $_SESSION['name'] . "\"":""; ?> type="text" id="name" name="name" placeholder="Enter your name here...">
                </td>
              </tr>
              <tr>
                <th>
                    <label for="email">E-mail</label>
                </th>
                <td>
                    <input  <?php echo isset($_SESSION['email']) ? "value=\"" . $_SESSION['email'] . "\"":""; ?> type="text" id="email" name="email" placeholder="Enter e-mail address here...">
                </td>
              </tr>
              <tr>
                <th>
                    <label for="message">Message</label>
                </th>
                <td>
                    <textarea name="message" id="message" placeholder="Enter message here..."><?php echo isset($_SESSION['message']) ? $_SESSION['message']:""; ?></textarea>
                </td>
              </tr>
              <tr style="display: none;">
                <th>
                    <label for="address">Address</label>
                </th>
                <td>
                    <input type="text" id="address" name="address" placeholder="Enter address here...">
                    <p>Humans: don't fill out this form, it is to trick the robots.</p>
                </td>
              </tr>
            </table>
            <input type="submit" value="Submit">
            
          </form>
        </section>
        <footer>
          <a href="http://www.facebook.com/toddnestor"><img src="img/facebook-wrap.png" alt="Facebook" class="social-icon"></a>
          <a href="http://www.twitter.com/@toddnestor"><img src="img/twitter-wrap.png" alt="Twitter" class="social-icon"></a>
          <a href="https://github.com/toddnestor"><img src="img/github.jpg" alt="Github" class="social-icon"></a>
          <a href="http://www.linkedin.com/pub/todd-nestor/3a/574/560"><img src="img/li.jpg" alt="LinkedIn" class="social-icon"></a>
          <p>&copy; Copyright 2014 Todd Nestor.</p>
        </footer>
    </div>
  </body>
</html>