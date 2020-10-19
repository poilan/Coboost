using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Coboost.Migrations
{
    [UsedImplicitly]
    public partial class Initial : Migration
    {
        #region Protected Methods

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                "SessionFolders");

            migrationBuilder.DropTable(
                "UserSessions");

            migrationBuilder.DropTable(
                "Folders");

            migrationBuilder.DropTable(
                "Sessions");

            migrationBuilder.DropTable(
                "Users");

            migrationBuilder.DropSequence(
                "SessionOrder_seq",
                "dbo");
        }

        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                "dbo");

            migrationBuilder.CreateSequence<int>(
                "SessionOrder_seq",
                "dbo",
                100000L);

            migrationBuilder.CreateTable(
                "Folders",
                table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Folders", x => x.Id); });

            migrationBuilder.CreateTable(
                "Sessions",
                table => new
                {
                    Identity = table.Column<int>(nullable: false,
                        defaultValueSql: "NEXT VALUE FOR dbo.SessionOrder_seq"),
                    Email = table.Column<string>(nullable: true),
                    LastOpen = table.Column<string>(nullable: true),
                    Questions = table.Column<string>(nullable: true),
                    Settings = table.Column<string>(nullable: true),
                    Slides = table.Column<string>(nullable: true),
                    Title = table.Column<string>(nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Sessions", x => x.Identity); });

            migrationBuilder.CreateTable(
                "Users",
                table => new
                {
                    Email = table.Column<string>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: true)
                },
                constraints: table => { table.PrimaryKey("PK_Users", x => x.Email); });

            migrationBuilder.CreateTable(
                "SessionFolders",
                table => new
                {
                    FolderId = table.Column<int>(nullable: false),
                    SessionId = table.Column<int>(nullable: false),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionFolders", x => new { x.FolderId, x.SessionId, x.UserId });
                    table.ForeignKey(
                        "FK_SessionFolders_Folders_FolderId",
                        x => x.FolderId,
                        "Folders",
                        "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_SessionFolders_Sessions_SessionId",
                        x => x.SessionId,
                        "Sessions",
                        "Identity",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_SessionFolders_Users_UserId",
                        x => x.UserId,
                        "Users",
                        "Email",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                "UserSessions",
                table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    SessionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSessions", x => new { x.UserId, x.SessionId });
                    table.ForeignKey(
                        "FK_UserSessions_Sessions_SessionId",
                        x => x.SessionId,
                        "Sessions",
                        "Identity",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        "FK_UserSessions_Users_UserId",
                        x => x.UserId,
                        "Users",
                        "Email",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                "IX_SessionFolders_SessionId",
                "SessionFolders",
                "SessionId");

            migrationBuilder.CreateIndex(
                "IX_SessionFolders_UserId",
                "SessionFolders",
                "UserId");

            migrationBuilder.CreateIndex(
                "IX_UserSessions_SessionId",
                "UserSessions",
                "SessionId");
        }

        #endregion Protected Methods
    }
}