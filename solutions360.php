<?php
  // DATABASE INFO
  $db_host = "localhost";
  $db_name = "solutions_360";
  $db_user = "solutions360";
  $db_pass = "solutionspassword";

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
  // ensuring connection was successful
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
  <h1>Branch Data</h1>

  <h2>Yearly Revenue Totals</h2>

  <?php
    // Query comparing yearly revenues, and calculating progress to forecast as a percentage
    $query = "SELECT {$branch}, {$last_fiscal}, {$current_fiscal}, {$yearly_forecast}, ";
    $query .= "ROUND ( ({$current_fiscal} / {$yearly_forecast}) * 100.00, 2) AS yearly_percent ";
    $query.= "FROM {$branches}";

    $yearly_revenues = mysqli_query($db, $query);

    if (!$yearly_revenues) {
      die("Database query failed.");
    }
  ?>

  <!-- Place holder for <rect /> tags to be added via D3 -->
  <div class="svg-1">
    <?php
      while ($branch_row = mysqli_fetch_assoc($yearly_revenues)) {
    ?>
    <div id="<?php echo str_replace(" ", "-", $branch_row[$branch]) ?>">
      <script type="text/javascript">
        // Make data available to javascript by encoding it to json
        encodeYearlyRevenues( <?php echo json_encode($branch_row) ?> );
      </script>
      
      <h5><?php echo $branch_row[$branch]; ?></h5>
    </div>
    <hr />
    <?php
      }
    ?>
  </div>

  <?php
    // unset data to free up server memory
    mysqli_free_result($yearly_revenues);
  ?>

  <h2>Percent of revenue to-date</h2>
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

  <div id="svg-2">
    <svg class="pie">
    </svg>
  </div>
</body>
</html>

<?php
  // close connection to 'solutions_360' database
  mysqli_close($db);
?>