use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Users table
        manager
            .create_table(
                Table::create()
                    .table(Users::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Users::UserId)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Users::Name).string().not_null())
                    .col(
                        ColumnDef::new(Users::Email)
                            .string()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(Users::EmailVerifiedAt).timestamp().null())
                    .col(ColumnDef::new(Users::Password).string().not_null())
                    .col(ColumnDef::new(Users::RememberToken).string_len(100).null())
                    .col(ColumnDef::new(Users::DeletedAt).timestamp().null())
                    .col(ColumnDef::new(Users::CreatedAt).timestamp().null())
                    .col(ColumnDef::new(Users::UpdatedAt).timestamp().null())
                    .to_owned(),
            )
            .await?;

        // Password reset tokens table
        manager
            .create_table(
                Table::create()
                    .table(PasswordResetTokens::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(PasswordResetTokens::Email)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(PasswordResetTokens::Token)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(PasswordResetTokens::CreatedAt)
                            .timestamp()
                            .null(),
                    )
                    .to_owned(),
            )
            .await?;

        // Sessions table
        manager
            .create_table(
                Table::create()
                    .table(Sessions::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Sessions::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Sessions::UserId).big_unsigned().null())
                    .col(ColumnDef::new(Sessions::IpAddress).string_len(45).null())
                    .col(ColumnDef::new(Sessions::UserAgent).text().null())
                    .col(ColumnDef::new(Sessions::Payload).text().not_null())
                    .col(ColumnDef::new(Sessions::LastActivity).integer().not_null())
                    .to_owned(),
            )
            .await?;

        // Index on sessions.user_id
        manager
            .create_index(
                Index::create()
                    .table(Sessions::Table)
                    .col(Sessions::UserId)
                    .name("idx_sessions_user_id")
                    .to_owned(),
            )
            .await?;

        // Index on sessions.last_activity
        manager
            .create_index(
                Index::create()
                    .table(Sessions::Table)
                    .col(Sessions::LastActivity)
                    .name("idx_sessions_last_activity")
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Users::Table).if_exists().to_owned())
            .await?;

        manager
            .drop_table(
                Table::drop()
                    .table(PasswordResetTokens::Table)
                    .if_exists()
                    .to_owned(),
            )
            .await?;

        manager
            .drop_table(Table::drop().table(Sessions::Table).if_exists().to_owned())
            .await?;

        Ok(())
    }
}

#[derive(DeriveIden)]
enum Users {
    Table,
    UserId,
    Name,
    Email,
    EmailVerifiedAt,
    Password,
    RememberToken,
    DeletedAt,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
enum PasswordResetTokens {
    Table,
    Email,
    Token,
    CreatedAt,
}

#[derive(DeriveIden)]
enum Sessions {
    Table,
    Id,
    UserId,
    IpAddress,
    UserAgent,
    Payload,
    LastActivity,
}
