use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(SitePreferences::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(SitePreferences::Id)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(SitePreferences::CreatedAt)
                            .timestamp()
                            .null(),
                    )
                    .col(
                        ColumnDef::new(SitePreferences::UpdatedAt)
                            .timestamp()
                            .null(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(SitePreferences::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum SitePreferences {
    Table,
    Id,
    CreatedAt,
    UpdatedAt,
}

