class Need < Product
	default_scope { where( "state not like '我的案例'")}
	belongs_to :owner
end
