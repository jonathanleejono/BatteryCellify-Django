"""create csvTimeSeriesData table

Revision ID: 5efe2f0150f0
Revises: a6240aabf018
Create Date: 2022-05-19 15:24:39.020098

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql.expression import text


# revision identifiers, used by Alembic.
revision = '5efe2f0150f0'
down_revision = 'a6240aabf018'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('csvTimeSeriesData',
                    sa.Column('id', sa.Integer(), nullable=False,
                              primary_key=True),
                    sa.Column('dateTime', sa.String(), nullable=False),
                    sa.Column('test_time_seconds', sa.Float(), nullable=False),
                    sa.Column('cycle_index', sa.Integer(), nullable=False),
                    sa.Column('currentA', sa.Float(), nullable=False),
                    sa.Column('voltage_v', sa.Float(), nullable=False),
                    sa.Column('charge_capacity_ah',
                              sa.Float(), nullable=False),
                    sa.Column('discharge_capacity_ah',
                              sa.Float(), nullable=False),
                    sa.Column('charge_energy_wh', sa.Float(), nullable=False),
                    sa.Column('discharge_energy_wh',
                              sa.Float(), nullable=False),
                    sa.Column('environmentTempCelsius',
                              sa.Float(), nullable=False),
                    sa.Column('cellTempCelsius', sa.Float(), nullable=False),
                    sa.Column("batteryCell_id", sa.Integer, sa.ForeignKey(
                        "batteryCells.id", ondelete="CASCADE"), nullable=False),
                    sa.Column("owner_id", sa.Integer, sa.ForeignKey(
                        "users.id", ondelete="CASCADE"), nullable=False),
                    sa.Column("created_at", sa.TIMESTAMP(
                        timezone=True), nullable=False, server_default=text('now()')),
                    )
    pass


def downgrade():
    pass
