"""create csvCycleData table

Revision ID: a6240aabf018
Revises: 6aae35ce63b0
Create Date: 2022-05-19 15:19:41.007530

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql.expression import text


# revision identifiers, used by Alembic.
revision = 'a6240aabf018'
down_revision = '6aae35ce63b0'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('csvCycleData',
                    sa.Column('id', sa.Integer(), nullable=False,
                              primary_key=True),
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
                    sa.Column("batteryCell_id", sa.Integer, sa.ForeignKey(
                        "batteryCells.id", ondelete="CASCADE"), nullable=False),
                    sa.Column("owner_id", sa.Integer, sa.ForeignKey(
                        "users.id", ondelete="CASCADE"), nullable=False),
                    sa.Column("created_at", sa.TIMESTAMP(
                        timezone=True), nullable=False, server_default=text('now()')),
                    )
    pass


def downgrade():
    op.drop_table('csvCycleData')
    pass
