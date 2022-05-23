"""create batteryCells table

Revision ID: 6aae35ce63b0
Revises: 40691b721479
Create Date: 2022-05-19 15:05:07.389475

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql.expression import text


# revision identifiers, used by Alembic.
revision = '6aae35ce63b0'
down_revision = '40691b721479'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('batteryCells',
                    sa.Column('id', sa.Integer(), nullable=False,
                              primary_key=True),
                    sa.Column('cell_name_id', sa.String(), nullable=False),
                    sa.Column('cycles', sa.String(), nullable=False),
                    sa.Column('cathode', sa.Enum('LCO', 'LFP', 'NCA', 'NMC', 'NMC-LCO', name="cathodeOptions_enum"),
                              nullable=False, server_default="LCO"),
                    sa.Column('anode', sa.Enum('graphite', name="anodeOptions_enum"),
                              nullable=False, server_default="graphite"),
                    sa.Column('capacity_ah', sa.Float(), nullable=False),
                    sa.Column('type', sa.Enum('18650', 'pouch', 'prismatic', name="typeOptions_enum"),
                              nullable=False, server_default="18650"),
                    sa.Column('source', sa.Enum('HNEI', 'UL-PUR', 'calce', 'oxford', 'snl', name="sourceOptions_enum"),
                              nullable=False, server_default="HNEI"),
                    sa.Column('temperature_c', sa.Float(), nullable=False),
                    sa.Column('max_state_of_charge',
                              sa.Float(), nullable=False),
                    sa.Column('min_state_of_charge',
                              sa.Float(), nullable=False),
                    sa.Column('depth_of_discharge',
                              sa.Float(), nullable=False),
                    sa.Column('charge_capacity_rate',
                              sa.Float(), nullable=False),
                    sa.Column('discharge_capacity_rate',
                              sa.Float(), nullable=False),
                    sa.Column("owner_id", sa.Integer, sa.ForeignKey(
                        "users.id", ondelete="CASCADE"), nullable=False),
                    sa.Column("created_at", sa.TIMESTAMP(
                        timezone=True), nullable=False, server_default=text('now()')),
                    )
    pass


def downgrade():
    op.drop_table('batteryCells')
    pass
