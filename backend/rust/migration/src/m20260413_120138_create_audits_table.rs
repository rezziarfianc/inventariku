use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Audits::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Audits::Id)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Audits::UserType).string().null())
                    .col(ColumnDef::new(Audits::UserId).big_unsigned().null())
                    .col(ColumnDef::new(Audits::Event).string().not_null())
                    .col(ColumnDef::new(Audits::AuditableType).string().not_null())
                    .col(
                        ColumnDef::new(Audits::AuditableId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .col(ColumnDef::new(Audits::OldValues).text().null())
                    .col(ColumnDef::new(Audits::NewValues).text().null())
                    .col(ColumnDef::new(Audits::Url).text().null())
                    .col(ColumnDef::new(Audits::IpAddress).string().null())
                    .col(ColumnDef::new(Audits::UserAgent).string_len(1023).null())
                    .col(ColumnDef::new(Audits::Tags).string().null())
                    .col(ColumnDef::new(Audits::CreatedAt).timestamp().null())
                    .col(ColumnDef::new(Audits::UpdatedAt).timestamp().null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-audits-user_id-user_type")
                    .table(Audits::Table)
                    .col(Audits::UserId)
                    .col(Audits::UserType)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-audits-auditable_type-auditable_id")
                    .table(Audits::Table)
                    .col(Audits::AuditableType)
                    .col(Audits::AuditableId)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Audits::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Audits {
    Table,
    Id,
    UserType,
    UserId,
    Event,
    AuditableType,
    AuditableId,
    OldValues,
    NewValues,
    Url,
    IpAddress,
    UserAgent,
    Tags,
    CreatedAt,
    UpdatedAt,
}

