use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 1. Create the Table
        manager
            .create_table(
                Table::create()
                    .table(Categories::Table)
                    .if_not_exists()
                    // Primary Key: matches Laravel's id() (unsigned BigInt)
                    .col(
                        ColumnDef::new(Categories::CategoryId)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    // String, length 15, unique
                    .col(
                        ColumnDef::new(Categories::Code)
                            .string_len(15)
                            .unique_key()
                            .not_null(),
                    )
                    // Parent ID: nullable unsigned BigInt
                    .col(ColumnDef::new(Categories::ParentId).big_unsigned().null())
                    // String, length 30
                    .col(ColumnDef::new(Categories::Name).string_len(30).not_null())
                    // Text, nullable
                    .col(ColumnDef::new(Categories::Description).text().null())
                    // timestamps() in Laravel creates nullable created_at and updated_at
                    .col(ColumnDef::new(Categories::CreatedAt).timestamp().null())
                    .col(ColumnDef::new(Categories::UpdatedAt).timestamp().null())
                    // softDeletes() creates nullable deleted_at
                    .col(ColumnDef::new(Categories::DeletedAt).timestamp().null())
                    // Foreign Key definition
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-categories-parent_id")
                            .from(Categories::Table, Categories::ParentId)
                            .to(Categories::Table, Categories::CategoryId)
                            .on_delete(ForeignKeyAction::SetNull)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        // 2. Create the Index on parent_id
        manager
            .create_index(
                Index::create()
                    .name("idx-categories-parent_id")
                    .table(Categories::Table)
                    .col(Categories::ParentId)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Drop the table (foreign keys and indexes are dropped automatically)
        manager
            .drop_table(Table::drop().table(Categories::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Categories {
    Table,
    CategoryId,
    Code,
    ParentId,
    Name,
    Description,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
}

