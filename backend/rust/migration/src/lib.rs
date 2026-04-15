pub use sea_orm_migration::prelude::*;

mod m20260413_120029_create_users_table;
mod m20260413_120038_create_categories_table;
mod m20260413_120045_create_products_table;
mod m20260413_120054_create_supplies_table;
mod m20260413_120107_create_supply_flows_table;
mod m20260413_120113_create_site_preferences_table;
mod m20260413_120128_create_permissions_table;
mod m20260413_120138_create_audits_table;
mod m20260413_120147_create_notifications_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260413_120029_create_users_table::Migration),
            Box::new(m20260413_120038_create_categories_table::Migration),
            Box::new(m20260413_120045_create_products_table::Migration),
            Box::new(m20260413_120054_create_supplies_table::Migration),
            Box::new(m20260413_120107_create_supply_flows_table::Migration),
            Box::new(m20260413_120113_create_site_preferences_table::Migration),
            Box::new(m20260413_120128_create_permissions_table::Migration),
            Box::new(m20260413_120138_create_audits_table::Migration),
            Box::new(m20260413_120147_create_notifications_table::Migration),
        ]
    }
}
