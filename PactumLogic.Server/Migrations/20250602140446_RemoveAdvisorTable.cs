using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PactumLogic.Server.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAdvisorTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractAdvisors_Advisors_AdvisorId",
                table: "ContractAdvisors");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_Advisors_AdministratorId",
                table: "Contracts");

            migrationBuilder.DropTable(
                name: "Advisors");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Clients",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Clients",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Clients_Email",
                table: "Clients",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAdvisors_Clients_AdvisorId",
                table: "ContractAdvisors",
                column: "AdvisorId",
                principalTable: "Clients",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_Clients_AdministratorId",
                table: "Contracts",
                column: "AdministratorId",
                principalTable: "Clients",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractAdvisors_Clients_AdvisorId",
                table: "ContractAdvisors");

            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_Clients_AdministratorId",
                table: "Contracts");

            migrationBuilder.DropIndex(
                name: "IX_Clients_Email",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Clients");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Clients",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateTable(
                name: "Advisors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Age = table.Column<int>(type: "int", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PersonalIdNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Advisors", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_ContractAdvisors_Advisors_AdvisorId",
                table: "ContractAdvisors",
                column: "AdvisorId",
                principalTable: "Advisors",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_Advisors_AdministratorId",
                table: "Contracts",
                column: "AdministratorId",
                principalTable: "Advisors",
                principalColumn: "Id");
        }
    }
}
