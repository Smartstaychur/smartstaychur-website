import "dotenv/config";
import mysql from "mysql2/promise";

const pool = mysql.createPool(process.env.DATABASE_URL);

async function main() {
  const [rows] = await pool.query("SELECT id, slug, name, address, city FROM restaurants WHERE isActive = true ORDER BY name");
  console.log(JSON.stringify(rows, null, 2));
  await pool.end();
}

main().catch(console.error);
