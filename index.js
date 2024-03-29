const Knex = require('knex')

const connection = {
  ssl: { rejectUnauthorized: false },
  host: 'cmpe-272-database.c86shpa0bekf.us-east-1.rds.amazonaws.com',
  database: 'employees',
  user: 'admin',
  password: 'rajatmig29'
}

const knex = Knex({
  client: `mysql`,
  connection
})

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*"
    }
  };
  const { searchfor, searchby } = event.pathParameters
  let responseData = {}

  try {
    const dbResp = await knex('view_employee_details').where('id', searchfor)
    let { FirstName: first_name,
      LastName: last_name,
      Department: department,
      dept_id,
      id: employee_id,
      parent_id: manager_id,
      manager_name,
      birth_date,
      gender,
      hire_date,
      current_title,
      current_salary } = dbResp[0]
    if (searchby != manager_id && searchby != employee_id) {
      current_salary = "REDACTED"
    }
    responseData = {
      first_name,
      last_name,
      department,
      dept_id,
      employee_id,
      manager_id,
      manager_name,
      current_title,
      current_salary,
      birth_date,
      gender,
      hire_date,
    }
  } catch (ex) {
    response.statusCode = 400
    response.body = ex
    console.error(ex)
    return response
  }
  response.body = JSON.stringify(responseData)
  return response;
};
