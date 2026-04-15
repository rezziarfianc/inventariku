use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Products::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Products::ProductId)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Products::Name).string_len(30).not_null())
                    .col(
                        ColumnDef::new(Products::Price)
                            .decimal_len(20, 2)
                            .default(0),
                    )
                    .col(ColumnDef::new(Products::Description).text().null())
                    .col(
                        ColumnDef::new(Products::LowStockThreshold)
                            .integer()
                            .default(0),
                    )
                    .col(ColumnDef::new(Products::CategoryId).big_unsigned().null())
                    .col(ColumnDef::new(Products::CreatedAt).timestamp().null())
                    .col(ColumnDef::new(Products::UpdatedAt).timestamp().null())
                    .col(ColumnDef::new(Products::DeletedAt).timestamp().null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-products-category_id")
                            .from(Products::Table, Products::CategoryId)
                            .to(Categories::Table, Categories::CategoryId)
                            .on_delete(ForeignKeyAction::SetNull)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-products-category_id")
                    .table(Products::Table)
                    .col(Products::CategoryId)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Products::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Products {
    Table,
    ProductId,
    Name,
    Price,
    Description,
    LowStockThreshold,
    CategoryId,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
}

#[derive(DeriveIden)]
enum Categories {
    Table,
    CategoryId,
}

