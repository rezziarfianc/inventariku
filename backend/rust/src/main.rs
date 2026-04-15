use actix_web::{App, HttpServer, middleware::Logger, web};
use sea_orm::{ConnectOptions, Database, DatabaseConnection, DbErr};
use std::env;
use std::time::Duration;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::from_path("../.env").ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let db_connection = setup_connection().await;
    let app_url = env::var("APP_URL").expect("APP_URL must be set");
    let app_port = env::var("APP_PORT").expect("APP_PORT must be set");

    let app_data = web::Data::new(db_connection);

    HttpServer::new(move || {
        App::new()
            .app_data(app_data.clone())
            .wrap(Logger::default())
    })
    .bind(format!("{}:{}", app_url, app_port))?
    .run()
    .await
}

async fn setup_connection() -> DatabaseConnection {
    // temp env, need to change this when the entire code move to root
    dotenvy::from_path("../.env").ok();
    let db_host = env::var("DB_HOST").expect("DB_HOST must be set");
    let db_port = env::var("DB_PORT").expect("DB_PORT must be set");
    let db_user = env::var("DB_USERNAME").expect("DB_USER must be set");
    let db_password = env::var("DB_PASSWORD").expect("DB_PASSWORD must be set");
    let db_name = env::var("DB_DATABASE").expect("DB_NAME must be set");

    // temp set to localhost
    let db_url = format!(
        "postgres://{}:{}@{}:{}/{}",
        db_user, db_password, db_host, db_port, db_name
    );

    println!("Connecting to database at: {}", db_url);

    let mut opt = ConnectOptions::new(db_url);

    opt.max_connections(50)
        .min_connections(1)
        .connect_timeout(Duration::from_secs(60))
        .idle_timeout(Duration::from_secs(10))
        .max_lifetime(Duration::from_secs(30))
        .sqlx_logging(false)
        .set_schema_search_path("my_schema");

    Database::connect(opt)
        .await
        .expect("Failed to connect to the database")
}
