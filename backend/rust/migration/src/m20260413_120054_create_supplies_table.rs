use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Supplies::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Supplies::SupplyId)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Supplies::ProductId).big_unsigned().null())
                    .col(ColumnDef::new(Supplies::Quantity).integer().not_null())
                    .col(ColumnDef::new(Supplies::CreatedAt).timestamp().null())
                    .col(ColumnDef::new(Supplies::UpdatedAt).timestamp().null())
                    .col(ColumnDef::new(Supplies::DeletedAt).timestamp().null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-supplies-product_id")
                            .from(Supplies::Table, Supplies::ProductId)
                            .to(Products::Table, Products::ProductId)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-supplies-product_id")
                    .table(Supplies::Table)
                    .col(Supplies::ProductId)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Supplies::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Supplies {
    Table,
    SupplyId,
    ProductId,
    Quantity,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
}

#[derive(DeriveIden)]
enum Products {
    Table,
    ProductId,
}

