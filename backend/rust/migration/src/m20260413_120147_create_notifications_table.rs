use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Notifications::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Notifications::Id)
                            .uuid()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Notifications::Type).string().not_null())
                    .col(
                        ColumnDef::new(Notifications::NotifiableType)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(Notifications::NotifiableId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .col(ColumnDef::new(Notifications::Data).text().not_null())
                    .col(ColumnDef::new(Notifications::ReadAt).timestamp().null())
                    .col(ColumnDef::new(Notifications::CreatedAt).timestamp().null())
                    .col(ColumnDef::new(Notifications::UpdatedAt).timestamp().null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-notifications-notifiable_type-notifiable_id")
                    .table(Notifications::Table)
                    .col(Notifications::NotifiableType)
                    .col(Notifications::NotifiableId)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Notifications::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Notifications {
    Table,
    Id,
    Type,
    NotifiableType,
    NotifiableId,
    Data,
    ReadAt,
    CreatedAt,
    UpdatedAt,
}

