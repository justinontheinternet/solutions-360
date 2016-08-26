<?php
  // DATABASE INFO
  $db_host = "us-cdbr-iron-east-04.cleardb.net";
  $db_name = "heroku_640a5cfadf61df1";
  $db_user = "b30044e1062018";
  $db_pass = "0eb50919";

  // BRANCHES TABLE INFO
  $branches = "branches";
  $branch = "branch_name";
  $current_month_rev = "current_month_revenue";
  $last_month_rev = "last_month_revenue";
  $monthly_forecast = "monthly_forecast";
  $month_percent = "month_percent";
  $current_fiscal = "current_fiscal_year";
  $yearly_forecast = "yearly_forecast";
  $last_fiscal = "last_fiscal_year";

  // connect to 'solutions_360' database
  $db = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
  // ensuring connection was successful by checking for an error number
  // check for number instead of error, because no error will still return an empty string
  if (mysqli_connect_errno()) {
    die("Database connection failed. Error #{mysqli_connect_errno()}: {mysqli_connect_error()}");
  }
?>

<!DOCTYPE html>
<html>
<head>
  <title>Solutions 360 Data by Justin Arruda</title>
  <link rel="stylesheet" type="text/css" href="styles.css">
  <script src="https://d3js.org/d3.v4.min.js"></script>
  <script src="index.js" type="text/javascript"></script>
</head>
<body>
  <!-- create container to keep contents from edges of page -->
  <div class="container">
    <header>
      <h1>Branch Data</h1>
    </header>

    <?php
      // Assemble query comparing yearly revenues, and calculating progress to forecast as a percentage
      $query = "SELECT {$branch}, {$last_fiscal}, {$current_fiscal}, {$yearly_forecast}, ";
      $query .= "ROUND ( ({$current_fiscal} / {$yearly_forecast}) * 100.00, 2) AS yearly_percent ";
      $query.= "FROM {$branches}";
      // send the query and store the result set in $yearly_revenues
      $yearly_revenues = mysqli_query($db, $query);
      // if there is no result set (not the same as empty result), then we know the query failed
      if (!$yearly_revenues) {
        die("Database query failed.");
      }
    ?>

    <h2>Yearly Revenue Totals by Branch</h2>
    <div class="bar-legend">
      <div><div class="bar-key" id="yearly-forecast"></div><p>2016 Forecast</p></div>
      <div><div class="bar-key" id="current-fiscal"></div><p>2016 Revenue To-Date</p></div>
      <div><div class="bar-key" id="last-fiscal"></div><p>2015 Revenue</p></div>
    </div>

    <div class="svg-1">

      <?php
        // creating an associative array from each row in the result set
        while ($branch_row = mysqli_fetch_assoc($yearly_revenues)) {
      ?>
      <!-- Placeholder <div> for <rect /> tags to be added via D3 -->
      <div class="bar-chart" id="<?php echo str_replace(" ", "-", $branch_row[$branch]) ?>">
        <script type="text/javascript">
          // Make data available to javascript by encoding it to json
          encodeYearlyRevenues( <?php echo json_encode($branch_row) ?> );
        </script>
      </div>
      <?php
        }
      ?>
    </div>

    <?php
      // unset data to free up server memory
      mysqli_free_result($yearly_revenues);
    ?>

    <h2>2016 Revenue Ratio</h2>
    <?php
      // Assemble query calculating percent of total year-to-date revenue per branch
      $query_2 = "SELECT {$branch}, {$current_fiscal}, ";
      $query_2 .= "ROUND( {$current_fiscal} / ";
      $query_2 .= "(SELECT SUM( {$current_fiscal} ) FROM {$branches} ";
      $query_2 .= ") * 100.00, 2) AS pct_of_total ";
      $query_2 .= "FROM {$branches} ";
      $query_2 .= "GROUP BY {$branch}";

      $branch_percent = mysqli_query($db, $query_2);

      if (!$branch_percent) {
        die("Database query failed");
      }
    ?>

      <?php
        while ($branch_row = mysqli_fetch_assoc($branch_percent)) {
      ?>
      <script type="text/javascript">
        encodeBranchPercent( <?php echo json_encode($branch_row) ?> );
      </script>
      <?php
        }
      ?>

    <?php
      mysqli_free_result($branch_percent);
    ?>

    <div class="svg-2">
      <!-- create a div around the <svg> to center it -->
      <div class="buffer"> 
        <svg class="pie">
        </svg>
      </div>
    </div>

  </div>
</body>
</html>

<?php
  // close connection to 'solutions_360' database
  mysqli_close($db);
?>