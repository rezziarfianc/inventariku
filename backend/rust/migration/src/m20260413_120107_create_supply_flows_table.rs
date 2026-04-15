use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(SupplyFlows::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(SupplyFlows::SupplyFlowId)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(SupplyFlows::SupplyId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .col(ColumnDef::new(SupplyFlows::ProductId).big_unsigned().null())
                    .col(ColumnDef::new(SupplyFlows::FlowType).string().not_null())
                    .col(ColumnDef::new(SupplyFlows::Quantity).integer().not_null())
                    .col(
                        ColumnDef::new(SupplyFlows::FlowDate)
                            .timestamp()
                            .default(Expr::current_timestamp())
                            .not_null(),
                    )
                    .col(ColumnDef::new(SupplyFlows::CreatedAt).timestamp().null())
                    .col(ColumnDef::new(SupplyFlows::UpdatedAt).timestamp().null())
                    .col(ColumnDef::new(SupplyFlows::DeletedAt).timestamp().null())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-supply_flows-supply_id")
                            .from(SupplyFlows::Table, SupplyFlows::SupplyId)
                            .to(Supplies::Table, Supplies::SupplyId)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-supply_flows-product_id")
                            .from(SupplyFlows::Table, SupplyFlows::ProductId)
                            .to(Products::Table, Products::ProductId)
                            .on_delete(ForeignKeyAction::SetNull)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-supply_flows-supply_id")
                    .table(SupplyFlows::Table)
                    .col(SupplyFlows::SupplyId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-supply_flows-product_id")
                    .table(SupplyFlows::Table)
                    .col(SupplyFlows::ProductId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-supply_flows-flow_type")
                    .table(SupplyFlows::Table)
                    .col(SupplyFlows::FlowType)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-supply_flows-flow_date")
                    .table(SupplyFlows::Table)
                    .col(SupplyFlows::FlowDate)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(SupplyFlows::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum SupplyFlows {
    Table,
    SupplyFlowId,
    SupplyId,
    ProductId,
    FlowType,
    Quantity,
    FlowDate,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
}

#[derive(DeriveIden)]
enum Supplies {
    Table,
    SupplyId,
}

#[derive(DeriveIden)]
enum Products {
    Table,
    ProductId,
}

