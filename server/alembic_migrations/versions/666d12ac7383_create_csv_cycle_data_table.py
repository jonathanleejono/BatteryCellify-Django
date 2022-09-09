"""create csv cycle data table

Revision ID: 666d12ac7383
Revises: ec54761fda80
Create Date: 2022-06-15 12:50:24.615210

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql.expression import text


# revision identifiers, used by Alembic.
revision = '666d12ac7383'
down_revision = 'ec54761fda80'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('csv_cycle_data',
                    sa.Column('id', sa.Integer(), nullable=False,
                              primary_key=True),
                    sa.Column("owner_id", sa.Integer, sa.ForeignKey(
                        "users.id", ondelete="CASCADE"), nullable=False),
                    sa.Column("battery_cell_id", sa.Integer, sa.ForeignKey(
                        "battery_cells.id", ondelete="CASCADE"), nullable=False),
                    sa.Column('cycle_index', sa.Integer(), nullable=False),
                    sa.Column('start_time', sa.Float(), nullable=False),
                    sa.Column('end_time', sa.Float(), nullable=False),
                    sa.Column('test_time_seconds', sa.Float(), nullable=False),
                    sa.Column('min_current_a', sa.Float(), nullable=False),
                    sa.Column('max_current_a', sa.Float(), nullable=False),
                    sa.Column('min_voltage_v',
                              sa.Float(), nullable=False),
                    sa.Column('max_voltage_v',
                              sa.Float(), nullable=False),
                    sa.Column('charge_capacity_ah',
                              sa.Float(), nullable=False),
                    sa.Column('discharge_capacity_ah',
                              sa.Float(), nullable=False),
                    sa.Column('charge_energy_wh', sa.Float(), nullable=False),
                    sa.Column('discharge_energy_wh',
                              sa.Float(), nullable=False),
                    sa.Column("created_at", sa.TIMESTAMP(
                        timezone=True), nullable=False, server_default=text('now()')),
                    )
    pass


def downgrade():
    op.drop_table('csv_cycle_data')
    pass
