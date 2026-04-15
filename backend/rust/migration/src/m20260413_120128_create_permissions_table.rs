use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Permissions::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Permissions::Id)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Permissions::Name).string().not_null())
                    .col(ColumnDef::new(Permissions::GuardName).string().not_null())
                    .col(ColumnDef::new(Permissions::CreatedAt).timestamp().null())
                    .col(ColumnDef::new(Permissions::UpdatedAt).timestamp().null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-permissions-name-guard_name")
                    .table(Permissions::Table)
                    .col(Permissions::Name)
                    .col(Permissions::GuardName)
                    .unique()
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Roles::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Roles::Id)
                            .big_unsigned()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Roles::TeamId).big_unsigned().null())
                    .col(ColumnDef::new(Roles::Name).string().not_null())
                    .col(ColumnDef::new(Roles::GuardName).string().not_null())
                    .col(ColumnDef::new(Roles::CreatedAt).timestamp().null())
                    .col(ColumnDef::new(Roles::UpdatedAt).timestamp().null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-roles-team_id-name-guard_name")
                    .table(Roles::Table)
                    .col(Roles::TeamId)
                    .col(Roles::Name)
                    .col(Roles::GuardName)
                    .unique()
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(ModelHasPermissions::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(ModelHasPermissions::PermissionId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(ModelHasPermissions::ModelType)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(ModelHasPermissions::ModelId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .primary_key(
                        Index::create()
                            .col(ModelHasPermissions::PermissionId)
                            .col(ModelHasPermissions::ModelId)
                            .col(ModelHasPermissions::ModelType),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-model_has_permissions-permission_id")
                            .from(
                                ModelHasPermissions::Table,
                                ModelHasPermissions::PermissionId,
                            )
                            .to(Permissions::Table, Permissions::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-model_has_permissions-model_id-model_type")
                    .table(ModelHasPermissions::Table)
                    .col(ModelHasPermissions::ModelId)
                    .col(ModelHasPermissions::ModelType)
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(ModelHasRoles::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(ModelHasRoles::RoleId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .col(ColumnDef::new(ModelHasRoles::ModelType).string().not_null())
                    .col(
                        ColumnDef::new(ModelHasRoles::ModelId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .primary_key(
                        Index::create()
                            .col(ModelHasRoles::RoleId)
                            .col(ModelHasRoles::ModelId)
                            .col(ModelHasRoles::ModelType),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-model_has_roles-role_id")
                            .from(ModelHasRoles::Table, ModelHasRoles::RoleId)
                            .to(Roles::Table, Roles::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx-model_has_roles-model_id-model_type")
                    .table(ModelHasRoles::Table)
                    .col(ModelHasRoles::ModelId)
                    .col(ModelHasRoles::ModelType)
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(RoleHasPermissions::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(RoleHasPermissions::PermissionId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(RoleHasPermissions::RoleId)
                            .big_unsigned()
                            .not_null(),
                    )
                    .primary_key(
                        Index::create()
                            .col(RoleHasPermissions::PermissionId)
                            .col(RoleHasPermissions::RoleId),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-role_has_permissions-permission_id")
                            .from(RoleHasPermissions::Table, RoleHasPermissions::PermissionId)
                            .to(Permissions::Table, Permissions::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-role_has_permissions-role_id")
                            .from(RoleHasPermissions::Table, RoleHasPermissions::RoleId)
                            .to(Roles::Table, Roles::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RoleHasPermissions::Table).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(ModelHasRoles::Table).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(ModelHasPermissions::Table).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(Roles::Table).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(Permissions::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Permissions {
    Table,
    Id,
    Name,
    GuardName,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
enum Roles {
    Table,
    Id,
    TeamId,
    Name,
    GuardName,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
enum ModelHasPermissions {
    Table,
    PermissionId,
    ModelType,
    ModelId,
}

#[derive(DeriveIden)]
enum ModelHasRoles {
    Table,
    RoleId,
    ModelType,
    ModelId,
}

#[derive(DeriveIden)]
enum RoleHasPermissions {
    Table,
    PermissionId,
    RoleId,
}

